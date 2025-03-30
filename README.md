# PockeTalke 

PockeTalke is a sleek, lightweight AI-powered chatbot that provides real-time responses in a minimalistic chat interface. Built with **React, Framer Motion, and Tailwind CSS**, it offers a smooth and interactive user experience.

## 🚀 Features
- **Live Chat Experience** with a typing effect for AI responses.
- **Markdown Support** for formatted bot messages.
- **Smooth Animations** using Framer Motion.
- **Command Support** (`/clear`, `/help` etc.).
- **Dark Mode UI** for a modern and sleek look.
- **Fast & Responsive** with a minimalistic design.

## 📦 Tech Stack
- **Frontend:** React, TypeScript, Framer Motion, Tailwind CSS
- **Backend:** API-based response fetching
- **Animations:** Framer Motion
- **Markdown Rendering:** react-showdown

## 🔧 Installation
To set up and run PockeTalke locally, follow these steps:

### 1️⃣ Clone the Repository
```sh
git clone https://github.com/your-username/pocketalke.git
cd pocketalke
```

### 2️⃣ Install Dependencies
```sh
npm install
# or
yarn install
```

### 3️⃣ Set Up Environment Variables
Create a `.env.local` file in the root of your project and add:
```sh
NEXT_PUBLIC_API_URL=https://your-api-endpoint.com
```
*(This ensures the API URL is not hardcoded in your code.)*

### 4️⃣ Run the Project
```sh
npm run dev
# or
yarn dev
```
Then, open [http://localhost:3000](http://localhost:3000) in your browser.

## 📝 Commands
| Command   | Description                  |
|-----------|------------------------------|
| `/clear`  | Clears the chat history      |
| `/help`   | Shows available commands     |

## 📸 Screenshots
*Coming Soon...*

## 🛠️ Customization
You can tweak the chatbot's behavior and appearance by modifying:
- `components/Chatbot.tsx` (UI logic)
- `styles/global.css` (Styling)
- `API calls` in `sendMessage` function

## 🤝 Contributing
Pull requests are welcome! For major changes, please open an issue first to discuss what you’d like to change.

## 📜 License
This project is open-source and available under the MIT License.

---
🚀 **Made with ❤️ by #031 from WeOwls**

