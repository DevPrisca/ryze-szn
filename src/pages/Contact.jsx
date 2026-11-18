import { useState } from "react";
import PageHero from "../components/PageHero.jsx";
import { useToast } from "../context/ToastContext.jsx";
import { BRAND, whatsappLink } from "../config.js";
import "./Contact.css";

function Contact() {
  const toast = useToast();

  const emptyForm = {
    name: "",
    email: "",
    phone: "",
    subject: "Order question",
    message: "",
    website: "", // hidden spam-trap field, must stay empty
  };

  const [form, setForm] = useState(emptyForm);
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  function handleChange(event) {
    setForm({ ...form, [event.target.name]: event.target.value });
  }
  async function handleSubmit(event) {
    event.preventDefault();

    if (form.name.trim().length < 2) {
      toast.showToast("Please enter your name.", "error");
      return;
    }
    if (form.email.trim() === "" && form.phone.trim() === "") {
      toast.showToast("Please give us an email or phone number so we can reply.", "error");
      return;
    }
    if (form.message.trim().length < 5) {
      toast.showToast("Please write your message.", "error");
      return;
    }

    setSending(true);

    // Build WhatsApp message from form
    const whatsappMessage = `Hello RYZE, new message from website:\n\nName: ${form.name}\nPhone: ${form.phone}\nEmail: ${form.email}\nSubject: ${form.subject}\nMessage: ${form.message}`;

    // Try to send to server first
    const API_BASE = (import.meta.env.VITE_API_URL || "").replace(/\/$/, "");
    try {
      const response = await fetch(`${API_BASE}/api/contact`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "The server could not accept your message.");
      }

      if (!result.emailSent) {
        throw new Error("Gmail could not send your message. Please send it through WhatsApp.");
      }

      toast.showToast("Your message has been sent to our team.", "success");
      setForm(emptyForm);
      setSent(true);
    } catch (error) {
      const message = error instanceof Error ? error.message : "The email service is unavailable.";
      toast.showToast(`${message} Opening WhatsApp as a fallback.`, "error");
    } finally {
      setSending(false);
    }

    // Always open WhatsApp so customer is never stuck
    window.open(whatsappLink(whatsappMessage), "_blank");
  }

  
  let buttonText = "Send message";
  if (sending === true) {
    buttonText = "Sending...";
  }

  let sentBox = null;
  if (sent === true) {
    sentBox = (
      <div className="sent-box">
        Thank you! Your message is with our team and we will get back to you shortly.
      </div>
    );
  }

  return (
    <div>
      <PageHero
        eyebrow="Get in touch"
        title="Contact"
        text="Questions about sizing, orders or delivery? We reply fast."
        big="HELLO"
      />

      <section className="section">
        <div className="container contact-layout">
          <div className="contact-info">
            <h2>Talk to us</h2>
            <p className="contact-lead">
              The quickest way to reach us is WhatsApp or a phone call. We are online every day.
            </p>

            <a href={"tel:" + BRAND.phoneLink} className="contact-item">
              <span className="contact-icon">☎</span>
              <div>
                <h4>Call us</h4>
                <p>{BRAND.phone}</p>
              </div>
            </a>

            {BRAND.additionalPhones.map(function (contact) {
              return (
                <div key={contact.name}>
                  <a href={"tel:" + contact.link} className="contact-item">
                    <span className="contact-icon">☎</span>
                    <div>
                      <h4>{contact.name}</h4>
                      <p>{contact.display}</p>
                    </div>
                  </a>
                  <a
                    href={whatsappLink("Hello RYZE, I have a question.", contact.whatsapp)}
                    target="_blank"
                    rel="noreferrer"
                    className="contact-item"
                  >
                    <span className="contact-icon">✆</span>
                    <div>
                      <h4>WhatsApp {contact.name}</h4>
                      <p>{contact.display}</p>
                    </div>
                  </a>
                </div>
              );
            })}

            <a
              href={whatsappLink("Hello RYZE, I have a question.")}
              target="_blank"
              rel="noreferrer"
              className="contact-item"
            >
              <span className="contact-icon">✆</span>
              <div>
                <h4>WhatsApp</h4>
                <p>Chat with us instantly</p>
              </div>
            </a>

            <a href={"mailto:" + BRAND.email} className="contact-item">
              <span className="contact-icon">✉</span>
              <div>
                <h4>Email</h4>
                <p>{BRAND.email}</p>
              </div>
            </a>

            <a href={BRAND.instagram} target="_blank" rel="noreferrer" className="contact-item">
              <span className="contact-icon">◎</span>
              <div>
                <h4>Instagram</h4>
                <p>{BRAND.instagramHandle}</p>
              </div>
            </a>

            <a href={BRAND.snapchat} target="_blank" rel="noreferrer" className="contact-item">
              <span className="contact-icon">👻</span>
              <div>
                <h4>Snapchat</h4>
                <p>{BRAND.snapchatHandle}</p>
              </div>
            </a>

            <a href={BRAND.tiktok} target="_blank" rel="noreferrer" className="contact-item">
              <span className="contact-icon">♪</span>
              <div>
                <h4>TikTok</h4>
                <p>{BRAND.tiktokHandle}</p>
              </div>
            </a>

            <div className="contact-item static">
              <span className="contact-icon">⌖</span>
              <div>
                <h4>Based in</h4>
                <p>{BRAND.location} - delivering nationwide</p>
              </div>
            </div>
          </div>

          <form className="contact-form" onSubmit={handleSubmit} noValidate>
            <h3>Send a message</h3>
            {sentBox}

            <div className="form-grid">
              <div className="field">
                <label htmlFor="c-name">Your name</label>
                <input id="c-name" name="name" type="text" value={form.name} onChange={handleChange} autoComplete="name" />
              </div>

              <div className="field">
                <label htmlFor="c-phone">Phone</label>
                <input id="c-phone" name="phone" type="tel" value={form.phone} onChange={handleChange} autoComplete="tel" />
              </div>

              <div className="field full">
                <label htmlFor="c-email">Email</label>
                <input id="c-email" name="email" type="email" value={form.email} onChange={handleChange} autoComplete="email" />
              </div>

              <div className="field full">
                <label htmlFor="c-subject">Subject</label>
                <select id="c-subject" name="subject" value={form.subject} onChange={handleChange}>
                  <option>Order question</option>
                  <option>Sizing help</option>
                  <option>Delivery</option>
                  <option>Wholesale or collaboration</option>
                  <option>Something else</option>
                </select>
              </div>

              <div className="field full">
                <label htmlFor="c-message">Message</label>
                <textarea id="c-message" name="message" value={form.message} onChange={handleChange} />
              </div>

              <div className="hp-field" aria-hidden="true">
                <label htmlFor="c-website">Website</label>
                <input id="c-website" name="website" type="text" value={form.website} onChange={handleChange} tabIndex="-1" autoComplete="off" />
              </div>
            </div>

            <button type="submit" className="btn btn-red btn-block send-btn" disabled={sending}>
              {buttonText}
            </button>
          </form>
        </div>
      </section>
    </div>
  );
}

export default Contact;
