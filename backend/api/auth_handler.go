// Email/password auth: signup and login.
// Passwords are hashed with bcrypt before storage.

package api

import (
	"net/http"
	"os"
	"strings"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt/v5"
	"golang.org/x/crypto/bcrypt"

	"foxvue-api/db"
)

type authHandler struct {
	users *db.UserRepo
}

func newAuthHandler(users *db.UserRepo) *authHandler {
	return &authHandler{users: users}
}

// POST /api/auth/signup
func (h *authHandler) signup(c *gin.Context) {
	var body struct {
		Name     string `json:"name"     binding:"required"`
		Email    string `json:"email"    binding:"required,email"`
		Password string `json:"password" binding:"required,min=8"`
	}
	if err := c.ShouldBindJSON(&body); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	body.Email = strings.ToLower(strings.TrimSpace(body.Email))

	// Check duplicate
	if _, err := h.users.GetByEmail(body.Email); err == nil {
		c.JSON(http.StatusConflict, gin.H{"error": "An account with that email already exists."})
		return
	}

	// Hash password
	hash, err := bcrypt.GenerateFromPassword([]byte(body.Password), bcrypt.DefaultCost)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to hash password."})
		return
	}

	user, err := h.users.CreateEmail(body.Email, body.Name, string(hash))
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create account."})
		return
	}

	token, err := signJWT(user.ID, user.Email, user.Name, user.Role)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to issue token."})
		return
	}

	c.JSON(http.StatusCreated, gin.H{
		"token": token,
		"user":  user.ToPublic(),
	})
}

// POST /api/auth/login
func (h *authHandler) login(c *gin.Context) {
	var body struct {
		Email    string `json:"email"    binding:"required,email"`
		Password string `json:"password" binding:"required"`
	}
	if err := c.ShouldBindJSON(&body); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	body.Email = strings.ToLower(strings.TrimSpace(body.Email))

	user, err := h.users.GetByEmail(body.Email)
	if err != nil || user.PasswordHash == nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Wrong credentials! Please check your email and password."})
		return
	}

	if err := bcrypt.CompareHashAndPassword([]byte(*user.PasswordHash), []byte(body.Password)); err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Wrong credentials! Please check your email and password."})
		return
	}

	token, err := signJWT(user.ID, user.Email, user.Name, user.Role)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to issue token."})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"token": token,
		"user":  user.ToPublic(),
	})
}

// GET /api/auth/me  — returns the current user from the JWT
func (h *authHandler) me(c *gin.Context) {
	userID, exists := c.Get("userID")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Not authenticated."})
		return
	}
	user, err := h.users.GetByID(userID.(string))
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "User not found."})
		return
	}
	c.JSON(http.StatusOK, user.ToPublic())
}

// signJWT creates a signed HS256 token valid for 7 days.
func signJWT(userID, email, name, role string) (string, error) {
	secret := os.Getenv("JWT_SECRET")
	if secret == "" {
		secret = "change-me-in-production"
	}
	claims := jwt.MapClaims{
		"sub":   userID,
		"email": email,
		"name":  name,
		"role":  role,
		"exp":   time.Now().Add(7 * 24 * time.Hour).Unix(),
	}
	return jwt.NewWithClaims(jwt.SigningMethodHS256, claims).SignedString([]byte(secret))
}
