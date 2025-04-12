<template>
  <section id="contact" class="contact-section">
    <div class="container">
      <h2 class="section-title">Me Contacter</h2>
      <p class="section-subtitle">
        Vous avez un projet en tête ou une question ? N'hésitez pas à me
        contacter !
      </p>

      <div class="contact-container">
        <!-- Coordonnées -->
        <div class="contact-info">
          <h3>Mes Coordonnées</h3>
          <div class="contact-method">
            <Icon name="mdi:email" size="1.5rem" />
            <div>
              <h4>Email</h4>
              <a href="mailto:votre.email@exemple.com"
                >votre.email@exemple.com</a
              >
            </div>
          </div>

          <div class="contact-method">
            <Icon name="mdi:phone" size="1.5rem" />
            <div>
              <h4>Téléphone</h4>
              <a href="tel:+33600000000">+33 6 00 00 00 00</a>
            </div>
          </div>

          <div class="contact-method">
            <Icon name="mdi:map-marker" size="1.5rem" />
            <div>
              <h4>Localisation</h4>
              <p>Paris, France</p>
            </div>
          </div>

          <div class="social-links">
            <a href="#" class="social-link" aria-label="LinkedIn">
              <Icon name="mdi:linkedin" size="1.5rem" />
            </a>
            <a href="#" class="social-link" aria-label="GitHub">
              <Icon name="mdi:github" size="1.5rem" />
            </a>
            <a href="#" class="social-link" aria-label="Twitter">
              <Icon name="mdi:twitter" size="1.5rem" />
            </a>
            <a href="#" class="social-link" aria-label="Instagram">
              <Icon name="mdi:instagram" size="1.5rem" />
            </a>
          </div>
        </div>

        <!-- Formulaire de contact -->
        <div class="contact-form-container">
          <form class="contact-form" @submit.prevent="submitForm">
            <div class="form-group">
              <label for="name">Nom</label>
              <div class="input-wrapper">
                <Icon name="mdi:account" size="1.2rem" />
                <input
                  id="name"
                  v-model="formData.name"
                  type="text"
                  placeholder="Votre nom"
                  required
                />
              </div>
            </div>

            <div class="form-group">
              <label for="email">Email</label>
              <div class="input-wrapper">
                <Icon name="mdi:email-outline" size="1.2rem" />
                <input
                  id="email"
                  v-model="formData.email"
                  type="email"
                  placeholder="Votre email"
                  required
                />
              </div>
            </div>

            <div class="form-group">
              <label for="subject">Sujet</label>
              <div class="input-wrapper">
                <Icon name="mdi:text-subject" size="1.2rem" />
                <input
                  id="subject"
                  v-model="formData.subject"
                  type="text"
                  placeholder="Sujet de votre message"
                  required
                />
              </div>
            </div>

            <div class="form-group">
              <label for="message">Message</label>
              <div class="textarea-wrapper">
                <Icon name="mdi:message-text" size="1.2rem" />
                <textarea
                  id="message"
                  v-model="formData.message"
                  placeholder="Votre message"
                  rows="5"
                  required
                ></textarea>
              </div>
            </div>

            <button
              type="submit"
              class="submit-button"
              :disabled="isSubmitting"
            >
              <span v-if="!isSubmitting">Envoyer</span>
              <span v-else class="loading">
                <span class="dot"></span>
                <span class="dot"></span>
                <span class="dot"></span>
              </span>
            </button>

            <div v-if="formSubmitted" class="form-success">
              <Icon name="mdi:check-circle" size="1.5rem" />
              Message envoyé avec succès !
            </div>
          </form>
        </div>
      </div>
    </div>
  </section>
</template>

<script lang="ts" setup>
import { ref } from "vue";

const formData = ref({
  name: "",
  email: "",
  subject: "",
  message: "",
});

const isSubmitting = ref(false);
const formSubmitted = ref(false);

const submitForm = () => {
  isSubmitting.value = true;

  // Simuler l'envoi du formulaire (remplacer par votre logique d'envoi réelle)
  setTimeout(() => {
    isSubmitting.value = false;
    formSubmitted.value = true;

    // Reset le formulaire et le message de succès après 5 secondes
    setTimeout(() => {
      formSubmitted.value = false;
      formData.value = {
        name: "",
        email: "",
        subject: "",
        message: "",
      };
    }, 5000);
  }, 2000);
};
</script>

<style scoped>
.contact-section {
  padding: 5rem 0;
  background-color: var(--contact-bg);
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1.5rem;
}

.section-title {
  font-size: 2rem;
  text-align: center;
  margin-bottom: 1rem;
  position: relative;
  color: var(--primary-color);
}

.section-subtitle {
  text-align: center;
  margin-bottom: 3rem;
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
  color: var(--text-color);
}

.section-title:after {
  content: "";
  position: absolute;
  bottom: -10px;
  left: 50%;
  transform: translateX(-50%);
  width: 80px;
  height: 3px;
  background: var(--primary-color);
}

.contact-container {
  display: flex;
  flex-wrap: wrap;
  gap: 2rem;
}

.contact-info {
  flex: 1;
  min-width: 280px;
  background-color: var(--contact-card-bg);
  padding: 2rem;
  border-radius: 10px;
  box-shadow: 0 8px 20px var(--modal-shadow-color);
}

.contact-info h3 {
  margin-bottom: 1.5rem;
  font-size: 1.5rem;
  color: var(--primary-color);
}

.contact-method {
  display: flex;
  align-items: flex-start;
  gap: 1rem;
  margin-bottom: 1.5rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.contact-method:last-of-type {
  border-bottom: none;
}

.contact-method svg {
  color: var(--primary-color);
  margin-top: 0.3rem;
}

.contact-method h4 {
  margin: 0 0 0.5rem;
  color: var(--text-color);
}

.contact-method p,
.contact-method a {
  margin: 0;
  color: var(--text-color);
}

.social-links {
  display: flex;
  gap: 1rem;
  margin-top: 2rem;
}

.social-link {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 50%;
  background-color: var(--contact-social-bg);
  color: var(--primary-color);
  transition: all 0.3s ease;
}

.social-link:hover {
  background-color: var(--primary-color);
  color: white;
  transform: translateY(-3px);
  text-decoration: none;
}

.contact-form-container {
  flex: 2;
  min-width: 280px;
  background-color: var(--contact-card-bg);
  padding: 2rem;
  border-radius: 10px;
  box-shadow: 0 8px 20px var(--modal-shadow-color);
}

.form-group {
  margin-bottom: 1.5rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
  color: var(--text-color);
}

.input-wrapper,
.textarea-wrapper {
  display: flex;
  padding-left: 1rem;
  align-items: center;
  position: relative;
  border-radius: 8px;
  background-color: var(--contact-input-bg);
  border: none;
  transition: all 0.3s ease;
}

.input-wrapper:focus-within,
.textarea-wrapper:focus-within {
  border-color: var(--primary-color);
  box-shadow: 0 0 0 2px rgba(99, 179, 237, 0.2);
}

.input-wrapper svg,
.textarea-wrapper svg {
  position: absolute;
  left: 1rem;
  color: var(--primary-color);
}

.input-wrapper input,
.textarea-wrapper textarea {
  width: 100%;
  padding: 0.8rem 1rem 0.8rem 2rem;
  border: none;
  border-radius: 8px;
  background-color: transparent;
  color: var(--text-color);
  font-size: 1rem;
}

.textarea-wrapper textarea {
  padding-top: 1rem;
}

.textarea-wrapper svg {
  top: 1rem;
}

.input-wrapper input::placeholder,
.textarea-wrapper textarea::placeholder {
  color: rgba(255, 255, 255, 0.5);
}

.input-wrapper input:focus,
.textarea-wrapper textarea:focus {
  outline: none;
}

.submit-button {
  display: block;
  width: 100%;
  padding: 1rem;
  background-color: var(--contact-button);
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.submit-button:hover {
  background-color: var(--contact-button-hover);
  transform: translateY(-2px);
}

.submit-button:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.loading {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 0.5rem;
}

.dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background-color: white;
  animation: bounce 1.5s infinite ease-in-out;
}

.dot:nth-child(2) {
  animation-delay: 0.2s;
}

.dot:nth-child(3) {
  animation-delay: 0.4s;
}

@keyframes bounce {
  0%,
  100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-10px);
  }
}

.form-success {
  margin-top: 1rem;
  padding: 1rem;
  background-color: rgba(72, 187, 120, 0.2);
  border-radius: 8px;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #48bb78;
}

.form-success svg {
  color: #48bb78;
}

/* Animation d'apparition */
.contact-section {
  animation: fadeIn 0.5s ease-in-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Media queries pour la responsivité */
@media (max-width: 768px) {
  .contact-container {
    flex-direction: column;
  }

  .contact-form-container,
  .contact-info {
    width: 100%;
  }
}

@media (max-width: 480px) {
  .section-title {
    font-size: 1.75rem;
  }

  .contact-info,
  .contact-form-container {
    padding: 1.5rem;
  }
}
</style>
