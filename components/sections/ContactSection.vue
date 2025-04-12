<template>
  <section id="contact" class="contact-section">
    <div class="container">
      <div class="section-header">
        <h2 class="section-title">Me Contacter</h2>
        <p class="section-subtitle">
          Vous avez un projet en tête ou une question ? N'hésitez pas à me
          contacter !
        </p>
      </div>

      <div class="contact-container">
        <!-- Carte coordonnées interactive -->
        <div class="contact-info">
          <div class="contact-card" :class="{ 'is-flipped': isCardFlipped }">
            <div class="contact-card-front">
              <h3>
                <Icon name="mdi:id-card" size="1.5rem" class="title-icon" /> Mes
                Coordonnées
              </h3>

              <div class="contact-method">
                <div class="contact-icon-wrapper">
                  <Icon name="mdi:email" size="1.5rem" />
                </div>
                <div>
                  <h4>Email</h4>
                  <a href="mailto:votre.email@exemple.com"
                    >votre.email@exemple.com</a
                  >
                </div>
              </div>

              <div class="contact-method">
                <div class="contact-icon-wrapper">
                  <Icon name="mdi:phone" size="1.5rem" />
                </div>
                <div>
                  <h4>Téléphone</h4>
                  <a href="tel:+33600000000">+33 6 00 00 00 00</a>
                </div>
              </div>

              <div class="contact-method">
                <div class="contact-icon-wrapper">
                  <Icon name="mdi:map-marker" size="1.5rem" />
                </div>
                <div>
                  <h4>Localisation</h4>
                  <p>Paris, France</p>
                </div>
              </div>

              <button class="flip-button" @click="flipCard">
                <span>Réseaux sociaux</span>
                <Icon name="mdi:rotate-3d-variant" size="1.2rem" />
              </button>
            </div>

            <div class="contact-card-back">
              <h3>
                <Icon
                  name="mdi:share-variant"
                  size="1.5rem"
                  class="title-icon"
                />
                Réseaux Sociaux
              </h3>

              <div class="social-grid">
                <a href="#" class="social-box linkedin">
                  <Icon name="mdi:linkedin" size="2rem" />
                  <span>LinkedIn</span>
                </a>
                <a href="#" class="social-box github">
                  <Icon name="mdi:github" size="2rem" />
                  <span>GitHub</span>
                </a>
                <a href="#" class="social-box twitter">
                  <Icon name="mdi:twitter" size="2rem" />
                  <span>Twitter</span>
                </a>
                <a href="#" class="social-box instagram">
                  <Icon name="mdi:instagram" size="2rem" />
                  <span>Instagram</span>
                </a>
              </div>

              <button class="flip-button" @click="flipCard">
                <span>Coordonnées</span>
                <Icon name="mdi:rotate-3d-variant" size="1.2rem" />
              </button>
            </div>
          </div>
        </div>

        <!-- Formulaire de contact -->
        <div class="contact-form-container">
          <form class="contact-form" @submit.prevent="submitForm">
            <div
              class="form-group"
              :class="{ 'form-focused': activeField === 'name' }"
            >
              <label for="name">
                <Icon name="mdi:account" size="1.2rem" class="label-icon" />
                Nom
              </label>
              <div class="input-wrapper">
                <input
                  id="name"
                  v-model="formData.name"
                  type="text"
                  placeholder="Votre nom"
                  required
                  @focus="setActiveField('name')"
                  @blur="setActiveField(null)"
                />
                <span class="input-line"></span>
              </div>
            </div>

            <div
              class="form-group"
              :class="{ 'form-focused': activeField === 'email' }"
            >
              <label for="email">
                <Icon
                  name="mdi:email-outline"
                  size="1.2rem"
                  class="label-icon"
                />
                Email
              </label>
              <div class="input-wrapper">
                <input
                  id="email"
                  v-model="formData.email"
                  type="email"
                  placeholder="Votre email"
                  required
                  @focus="setActiveField('email')"
                  @blur="setActiveField(null)"
                />
                <span class="input-line"></span>
              </div>
            </div>

            <div
              class="form-group"
              :class="{ 'form-focused': activeField === 'subject' }"
            >
              <label for="subject">
                <Icon
                  name="mdi:text-subject"
                  size="1.2rem"
                  class="label-icon"
                />
                Sujet
              </label>
              <div class="input-wrapper">
                <input
                  id="subject"
                  v-model="formData.subject"
                  type="text"
                  placeholder="Sujet de votre message"
                  required
                  @focus="setActiveField('subject')"
                  @blur="setActiveField(null)"
                />
                <span class="input-line"></span>
              </div>
            </div>

            <div
              class="form-group"
              :class="{ 'form-focused': activeField === 'message' }"
            >
              <label for="message">
                <Icon
                  name="mdi:message-text"
                  size="1.2rem"
                  class="label-icon"
                />
                Message
              </label>
              <div class="textarea-wrapper">
                <textarea
                  id="message"
                  v-model="formData.message"
                  placeholder="Votre message"
                  rows="5"
                  required
                  @focus="setActiveField('message')"
                  @blur="setActiveField(null)"
                ></textarea>
                <span class="input-line"></span>
              </div>
            </div>

            <button
              type="submit"
              class="submit-button"
              :disabled="isSubmitting"
              :class="{ 'button-pulse': !isSubmitting }"
            >
              <span v-if="!isSubmitting">
                <Icon name="mdi:send" size="1.2rem" class="send-icon" />
                Envoyer
              </span>
              <span v-else class="loading">
                <span class="dot"></span>
                <span class="dot"></span>
                <span class="dot"></span>
              </span>
            </button>

            <transition name="fade">
              <div v-if="formSubmitted" class="form-success">
                <Icon name="mdi:check-circle" size="1.5rem" />
                Message envoyé avec succès !
              </div>
            </transition>
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
const isCardFlipped = ref(false);
const activeField = ref<"name" | "email" | "subject" | "message" | null>(null);

const flipCard = () => {
  isCardFlipped.value = !isCardFlipped.value;
};

interface FormFields {
  name: "name" | "email" | "subject" | "message" | null;
}

const setActiveField = (field: FormFields["name"]): void => {
  activeField.value = field;
};

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

.section-header {
  text-align: center;
  margin-bottom: 3rem;
}

.section-title {
  font-size: 2.5rem;
  margin-bottom: 1rem;
  position: relative;
  color: var(--primary-color);
  display: inline-block;
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
  border-radius: 3px;
}

.section-subtitle {
  max-width: 600px;
  margin: 1.5rem auto 0;
  color: var(--text-color);
  font-size: 1.1rem;
}

.title-icon {
  vertical-align: middle;
  margin-right: 0.5rem;
}

.contact-container {
  display: flex;
  flex-wrap: wrap;
  gap: 2.5rem;
}

/* Carte de contact interactive avec effet flip */
.contact-info {
  flex: 1;
  min-width: 320px;
  perspective: 1000px;
}

.contact-card {
  position: relative;
  width: 100%;
  height: 100%;
  min-height: 400px;
  transition: transform 0.8s;
  transform-style: preserve-3d;
}

.contact-card.is-flipped {
  transform: rotateY(180deg);
}

.contact-card-front,
.contact-card-back {
  position: absolute;
  width: 100%;
  height: 100%;
  padding: 2rem;
  border-radius: 15px;
  box-shadow: 0 10px 30px var(--modal-shadow-color);
  background-color: var(--contact-card-bg);
  backface-visibility: hidden;
  display: flex;
  flex-direction: column;
}

.contact-card-back {
  transform: rotateY(180deg);
}

.contact-card h3 {
  margin-bottom: 2rem;
  font-size: 1.6rem;
  color: var(--primary-color);
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.contact-method {
  display: flex;
  align-items: flex-start;
  gap: 1.2rem;
  margin-bottom: 1.8rem;
  padding-bottom: 1.2rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.contact-method:last-of-type {
  border-bottom: none;
}

.contact-icon-wrapper {
  background-color: var(--contact-social-bg);
  width: 3rem;
  height: 3rem;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  color: var(--primary-color);
  transition: all 0.3s ease;
}

.contact-method:hover .contact-icon-wrapper {
  transform: scale(1.1);
  background-color: var(--primary-color);
  color: white;
}

.contact-method h4 {
  margin: 0 0 0.5rem;
  color: var(--text-color);
  font-weight: 600;
}

.contact-method p,
.contact-method a {
  margin: 0;
  color: var(--text-color);
  transition: all 0.3s ease;
}

.contact-method a:hover {
  color: var(--primary-color);
  text-decoration: none;
}

/* Grille des réseaux sociaux */
.social-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  grid-template-rows: repeat(2, 1fr);
  gap: 1rem;
  margin: 1rem 0;
  flex-grow: 1;
}

.social-box {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  background-color: var(--contact-social-bg);
  padding: 1.5rem;
  border-radius: 10px;
  transition: all 0.3s ease;
  color: var(--text-color);
}

.social-box span {
  font-weight: 500;
}

.social-box:hover {
  transform: translateY(-5px);
  text-decoration: none;
}

.social-box.linkedin:hover {
  background-color: #0077b5;
  color: white;
}

.social-box.github:hover {
  background-color: #333;
  color: white;
}

.social-box.twitter:hover {
  background-color: #1da1f2;
  color: white;
}

.social-box.instagram:hover {
  background: linear-gradient(
    45deg,
    #f09433,
    #e6683c,
    #dc2743,
    #cc2366,
    #bc1888
  );
  color: white;
}

.flip-button {
  align-self: center;
  margin-top: auto;
  background-color: var(--contact-social-bg);
  border: none;
  color: var(--text-color);
  padding: 0.8rem 1.2rem;
  border-radius: 50px;
  cursor: pointer;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.3s ease;
}

.flip-button:hover {
  background-color: var(--primary-color);
  color: white;
  transform: scale(1.05);
}

/* Formulaire de contact */
.contact-form-container {
  flex: 2;
  min-width: 320px;
  background-color: var(--contact-card-bg);
  padding: 2.5rem;
  border-radius: 15px;
  box-shadow: 0 10px 30px var(--modal-shadow-color);
}

.form-group {
  margin-bottom: 1.8rem;
  position: relative;
}

.form-group label {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.8rem;
  font-weight: 500;
  color: var(--text-color);
  transition: color 0.3s ease;
}

.label-icon {
  color: var(--text-color);
  opacity: 0.7;
  transition: opacity 0.3s ease;
}

.form-focused label {
  color: var(--primary-color);
}

.form-focused .label-icon {
  color: var(--primary-color);
  opacity: 1;
}

.input-wrapper,
.textarea-wrapper {
  position: relative;
  border-radius: 8px;
  background-color: var(--contact-input-bg);
  transition: all 0.3s ease;
  overflow: hidden;
}

.input-wrapper input,
.textarea-wrapper textarea {
  width: 100%;
  padding: 1rem 1.2rem;
  border: none;
  background-color: transparent;
  color: var(--text-color);
  font-size: 1rem;
  z-index: 2;
  position: relative;
}

.input-line {
  position: absolute;
  bottom: 0;
  left: 0;
  height: 2px;
  width: 0;
  background-color: var(--primary-color);
  transition: width 0.3s ease;
}

.form-focused .input-line {
  width: 100%;
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
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.8rem;
  width: 100%;
  padding: 1.1rem;
  background-color: var(--contact-button);
  color: white;
  border: none;
  border-radius: 50px;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  overflow: hidden;
  position: relative;
}

.button-pulse {
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0% {
    box-shadow: 0 0 0 0 rgba(var(--primary-color-rgb, 89, 165, 235), 0.7);
  }
  70% {
    box-shadow: 0 0 0 15px rgba(var(--primary-color-rgb, 89, 165, 235), 0);
  }
  100% {
    box-shadow: 0 0 0 0 rgba(var(--primary-color-rgb, 89, 165, 235), 0);
  }
}

.submit-button:hover {
  background-color: var(--contact-button-hover);
  transform: translateY(-3px);
}

.submit-button:disabled {
  opacity: 0.7;
  cursor: not-allowed;
  transform: translateY(0);
}

.send-icon {
  transition: transform 0.3s ease;
}

.submit-button:hover .send-icon {
  transform: translateX(5px);
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
  margin-top: 1.2rem;
  padding: 1rem;
  background-color: rgba(72, 187, 120, 0.2);
  border-radius: 8px;
  display: flex;
  align-items: center;
  gap: 0.8rem;
  color: #48bb78;
}

.form-success svg {
  color: #48bb78;
}

.fade-enter-active,
.fade-leave-active {
  transition:
    opacity 0.5s ease,
    transform 0.5s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(10px);
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

  .contact-card,
  .contact-card-front,
  .contact-card-back {
    min-height: 350px;
  }
}

@media (max-width: 480px) {
  .section-title {
    font-size: 2rem;
  }

  .contact-info,
  .contact-form-container {
    padding: 1.5rem;
  }

  .social-grid {
    grid-template-columns: 1fr;
  }
}
</style>
