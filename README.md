# Meta Pareja 💖 | Ahorra en Pareja, Sueña en Grande

**Meta Pareja** is a joint savings tracker designed for modern couples who want to reach financial milestones together without the complexity (or privacy concerns) of merging bank accounts.

Built as a high-fidelity MVP, it focuses on transparency, motivation, and simplicity.

---

## 🚀 Key Features

- **Google-Powered Auth**: Seamless login experience without needing to remember another password.
- **Pairing via Invite Codes**: Securely link with your partner using a unique, time-sensitive code.
- **Smart Goal Setting**: Define shared dreams (Travel 🏖️, Home 🏠, Wedding 💍) with specific targets and deadlines.
- **AI Financial Coach**: Integrated with **Google Gemini API**, providing personalized, playful, and motivating financial tips based on your current progress.
- **Real-time Notifications**: Get notified the moment your partner makes a contribution.
- **Zero-Bank Integration**: A privacy-first approach where you track contributions manually, keeping your actual bank accounts private.

## 🛠️ Tech Stack

- **Framework**: [React 19](https://react.dev/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **AI Engine**: [Google Gemini 3 Flash](https://ai.google.dev/)
- **Routing**: [React Router 7](https://reactrouter.com/)
- **Database**: Simulated via LocalStorage for offline-first, instant demo capabilities.

## 📂 Project Structure

```text
/
├── components/       # Reusable UI components (Navbar, etc.)
├── lib/              # Logic & Utilities (Calculations, Mock DB)
├── views/            # Main application screens (Dashboard, Pairing, etc.)
├── types.ts          # Global TypeScript definitions
├── geminiService.ts  # Integration with Google GenAI SDK
└── App.tsx           # Main routing and state management
```

## ⚙️ Getting Started

### Prerequisites

To enable the AI Financial Coach features, you need a Google Gemini API Key.

1.  Get your key from [Google AI Studio](https://aistudio.google.com/).
2.  Ensure your environment has access to `process.env.API_KEY`.

### Installation

1.  Clone the repository:
    ```bash
    git clone https://github.com/your-username/meta-pareja-mvp.git
    ```
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Run the development server:
    ```bash
    npm start
    ```

## 🧠 How the AI Works

The app uses the `gemini-3-flash-preview` model to analyze your current savings progress:
- It calculates the percentage of the goal achieved.
- It determines how many days are left until your deadline.
- It generates a 2-3 sentence "Financial Tip" that is supportive and tailored to the couple's specific goal (e.g., "If you skip one coffee a week, you'll reach the beach 5 days sooner!").

## 🛡️ Privacy & Security

Meta Pareja is a **tracker**, not a wallet. We never ask for:
- Credit card numbers.
- Bank login credentials.
- Legal financial documents.

It is designed to facilitate communication and visibility between partners.

---

Developed with ❤️ for couples who believe in financial teamwork.
