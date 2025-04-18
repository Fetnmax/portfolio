<template>
  <section id="contact" class="contact-section">
    <div class="contact-container">
      <div class="contact-header">
        <h2 class="section-title">Contact</h2>
        <p class="section-subtitle">
          N'hésitez pas à me contacter pour discuter de projets ou
          d'opportunités
        </p>
      </div>

      <div class="contact-content">
        <div class="contact-form-container">
          <form @submit.prevent="submitForm" class="contact-form">
            <div class="form-group">
              <label for="name">Nom</label>
              <input
                type="text"
                id="name"
                v-model="formData.name"
                required
                class="form-input"
                :class="{ 'input-error': errors.name }"
              />
              <span v-if="errors.name" class="error-message">{{
                errors.name
              }}</span>
            </div>

            <div class="form-group">
              <label for="email">Email</label>
              <input
                type="email"
                id="email"
                v-model="formData.email"
                required
                class="form-input"
                :class="{ 'input-error': errors.email }"
              />
              <span v-if="errors.email" class="error-message">{{
                errors.email
              }}</span>
            </div>

            <div class="form-group">
              <label for="message">Message</label>
              <textarea
                id="message"
                v-model="formData.message"
                required
                class="form-textarea"
                :class="{ 'input-error': errors.message }"
              ></textarea>
              <span v-if="errors.message" class="error-message">{{
                errors.message
              }}</span>
            </div>

            <div class="form-group" style="display: none">
              <label for="website">Website</label>
              <input
                type="text"
                id="website"
                v-model="formData.website"
                class="form-input"
                autocomplete="off"
              />
            </div>

            <div class="form-actions">
              <button
                type="submit"
                class="submit-button"
                :disabled="isSubmitting"
              >
                <span v-if="isSubmitting" class="spinner"></span>
                <span v-else>Envoyer</span>
              </button>

              <div class="social-links">
                <a
                  href="https://github.com/Fetnmax"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="social-link github"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  >
                    <path
                      d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"
                    ></path>
                  </svg>
                  <span>GitHub</span>
                </a>
              </div>
            </div>
          </form>
        </div>
      </div>

      <div class="success-message" v-if="showSuccessMessage">
        <div class="success-content">
          <svg
            class="checkmark"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 52 52"
          >
            <circle
              class="checkmark-circle"
              cx="26"
              cy="26"
              r="25"
              fill="none"
            />
            <path
              class="checkmark-check"
              fill="none"
              d="M14.1 27.2l7.1 7.2 16.7-16.8"
            />
          </svg>
          <h3>Message envoyé !</h3>
          <p>
            Merci pour votre message. Je vous répondrai dans les plus brefs
            délais.
          </p>
          <button @click="closeSuccessMessage" class="close-button">
            Fermer
          </button>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
export default {
  name: "ContactSection",
  data() {
    return {
      formData: {
        name: "",
        email: "",
        message: "",
        website: "", // Champ honeypot
      },
      errors: {
        name: "",
        email: "",
        message: "",
      },
      isSubmitting: false,
      showSuccessMessage: false,
    };
  },
  methods: {
    validateForm() {
      let isValid = true;
      this.errors = {
        name: "",
        email: "",
        message: "",
      };

      if (!this.formData.name.trim()) {
        this.errors.name = "Le nom est requis";
        isValid = false;
      }

      if (!this.formData.email.trim()) {
        this.errors.email = "L'email est requis";
        isValid = false;
      } else if (!this.isValidEmail(this.formData.email)) {
        this.errors.email = "Veuillez entrer un email valide";
        isValid = false;
      }

      if (!this.formData.message.trim()) {
        this.errors.message = "Le message est requis";
        isValid = false;
      }

      return isValid;
    },
    isValidEmail(email) {
      const re =
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      return re.test(String(email).toLowerCase());
    },
    async submitForm() {
      if (!this.validateForm()) return;

      this.isSubmitting = true;

      try {
        // Envoyer les données au backend
        const response = await fetch("/api/contact", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(this.formData),
        });

        const result = await response.json();

        if (!result.success) {
          throw new Error(
            result.message || "Erreur lors de l'envoi du message"
          );
        }

        // Réinitialiser le formulaire
        this.formData = {
          name: "",
          email: "",
          message: "",
          website: "",
        };

        // Afficher le message de succès
        this.showSuccessMessage = true;
      } catch (error) {
        console.error("Erreur lors de l'envoi du formulaire:", error);
        alert(
          error.message ||
            "Une erreur est survenue lors de l'envoi du formulaire. Veuillez réessayer."
        );
      } finally {
        this.isSubmitting = false;
      }
    },
    closeSuccessMessage() {
      this.showSuccessMessage = false;
    },
  },
};
</script>

<style scoped>
.contact-section {
  padding: 80px 20px;
  background-color: var(--contact-bg);
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
}

.contact-container {
  max-width: 800px;
  margin: 0 auto;
  width: 100%;
  position: relative;
}

.contact-header {
  text-align: center;
  margin-bottom: 60px;
}

.section-title {
  font-size: 2.5rem;
  margin-bottom: 15px;
  position: relative;
  display: inline-block;
  color: var(--primary-color);
}

.section-title::after {
  content: "";
  position: absolute;
  bottom: -10px;
  left: 50%;
  transform: translateX(-50%);
  width: 50px;
  height: 3px;
  background-color: var(--primary-color);
}

.section-subtitle {
  font-size: 1.1rem;
  opacity: 0.8;
  max-width: 600px;
  margin: 0 auto;
}

.contact-content {
  display: flex;
  justify-content: center;
}

.contact-form-container {
  background-color: var(--contact-card-bg);
  border-radius: 10px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.05);
  padding: 40px;
  width: 100%;
  transition:
    transform 0.3s ease,
    box-shadow 0.3s ease;
}

.contact-form-container:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
}

.form-group {
  margin-bottom: 25px;
  position: relative;
}

.form-group label {
  display: block;
  margin-bottom: 8px;
  font-weight: 500;
  font-size: 0.9rem;
}

.form-input,
.form-textarea {
  width: 100%;
  padding: 14px 16px;
  border: 1px solid transparent;
  border-radius: 6px;
  background-color: var(--contact-input-bg);
  font-size: 1rem;
  color: var(--text-color);
  transition:
    border-color 0.3s ease,
    box-shadow 0.3s ease;
  box-sizing: border-box;
}

.form-input:focus,
.form-textarea:focus {
  outline: none;
  border-color: var(--primary-color);
  box-shadow: 0 0 0 3px rgba(49, 130, 206, 0.2);
}

.form-textarea {
  min-height: 180px;
  resize: vertical;
}

.input-error {
  border-color: #e53e3e !important;
}

.error-message {
  color: #e53e3e;
  font-size: 0.8rem;
  margin-top: 5px;
  display: block;
}

.form-actions {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.submit-button {
  background-color: var(--contact-button);
  color: white;
  border: none;
  border-radius: 6px;
  padding: 14px 24px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition:
    background-color 0.3s ease,
    transform 0.2s ease;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.submit-button:hover {
  background-color: var(--contact-button-hover);
  transform: translateY(-2px);
}

.submit-button:active {
  transform: translateY(0);
}

.submit-button:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.spinner {
  display: inline-block;
  width: 20px;
  height: 20px;
  border: 3px solid rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  border-top-color: #fff;
  animation: spin 1s ease-in-out infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.social-links {
  display: flex;
  justify-content: center;
  margin-top: 10px;
}

.social-link {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  padding: 12px 20px;
  border-radius: 8px;
  background-color: var(--contact-social-bg);
  transition:
    transform 0.3s ease,
    box-shadow 0.3s ease;
  text-decoration: none;
  color: var(--text-color);
  width: auto;
}

.social-link:hover {
  transform: translateY(-3px);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
  text-decoration: none;
}

.github svg {
  stroke: var(--primary-color);
}

.success-message {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  animation: fadeIn 0.3s ease;
}

.success-content {
  background-color: var(--contact-card-bg);
  border-radius: 10px;
  padding: 40px;
  text-align: center;
  max-width: 400px;
  width: 90%;
  animation: slideUp 0.4s ease;
}

.success-content h3 {
  margin: 20px 0 10px;
  font-size: 1.5rem;
  color: var(--text-color);
}

.success-content p {
  margin-bottom: 25px;
  opacity: 0.9;
}

.close-button {
  background-color: var(--primary-color);
  color: white;
  border: none;
  border-radius: 6px;
  padding: 10px 20px;
  font-size: 0.9rem;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.close-button:hover {
  background-color: var(--contact-button-hover);
}

.checkmark {
  width: 56px;
  height: 56px;
  margin: 0 auto;
}

.checkmark-circle {
  stroke-dasharray: 166;
  stroke-dashoffset: 166;
  stroke-width: 2;
  stroke-miterlimit: 10;
  stroke: var(--primary-color);
  fill: none;
  animation: stroke 0.6s cubic-bezier(0.65, 0, 0.45, 1) forwards;
}

.checkmark-check {
  transform-origin: 50% 50%;
  stroke-dasharray: 48;
  stroke-dashoffset: 48;
  stroke-width: 3;
  stroke: var(--primary-color);
  animation: stroke 0.3s cubic-bezier(0.65, 0, 0.45, 1) 0.8s forwards;
}

@keyframes stroke {
  100% {
    stroke-dashoffset: 0;
  }
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Styles responsifs */
@media (max-width: 768px) {
  .contact-container {
    padding: 0 15px;
  }

  .contact-form-container {
    padding: 30px 20px;
  }

  .section-title {
    font-size: 2rem;
  }
}
</style>
