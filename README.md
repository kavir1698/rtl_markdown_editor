# RTL Markdown Editor

A simple markdown editor for Right-to-Left (RTL) languages (e.g. Persian, Arabic, Hebrew).

## Development Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js and npm:** Download and install from [https://nodejs.org/](https://nodejs.org/).
- **Git:** (Optional) For cloning the repository. Download from [https://git-scm.com/](https://git-scm.com/).

## Building

1. **Clone the repository:**
   ```bash
   git clone https://github.com/your-username/rtl-markdown.git
   cd rtl-markdown
   ```
2. ** Install dependencies:**
  `npm install`
3. **Start the application:**
  `npm start`
4. **Build binaries:**
  `npm run build`

### To build for different platforms:

1. For all platforms: `npm run build`
2. For macOS only: `npm run build:mac`
3. For Windows only: `npm run build:win`
4. For Linux only: `npm run build:linux`

#### Important notes:

1. Building for macOS is only possible on a Mac.
2. Building for Windows is possible on macOS and Linux using Wine, but it's recommended to build on a Windows machine for best results.
3. Building for Linux is possible on any platform.