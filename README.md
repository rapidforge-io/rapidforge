# RapidForge

<p align="center">
  <strong>A lightweight, self-hosted platform for building and deploying webhooks, APIs, and scheduled tasks using simple scripts.</strong>
</p>

<p align="center">
  <a href="https://github.com/rapidforge-io/rapidforge/blob/main/LICENSE.md"><img src="https://img.shields.io/badge/license-Apache%202.0-blue.svg" alt="License"></a>
  <a href="https://golang.org/"><img src="https://img.shields.io/badge/Go-1.21+-00ADD8?logo=go" alt="Go Version"></a>
</p>

---

## Overview

RapidForge is a modern, self-hosted platform that lets you quickly create webhooks, APIs, periodic tasks, and dynamic pages using Bash or Lua scripts. Built with simplicity and performance in mind, RapidForge provides a clean web interface for managing your automation workflows without the complexity of traditional API frameworks.

## ✨ Key Features

- **🚀 Simple Webhook Creation** - Create HTTP endpoints instantly with custom paths and methods
- **⏰ Scheduled Tasks** - Run scripts periodically with cron-like scheduling
- **📄 Dynamic Pages** - Build interactive web pages with embedded scripts
- **🔐 Built-in Authentication** - OAuth2 integration and bearer token support
- **💾 SQLite Powered** - Lightweight, serverless database with zero configuration
- **🎨 Modern UI** - Clean admin interface built with HTMX and Shoelace components
- **🐳 Docker Ready** - Deploy anywhere with Docker support
- **🔧 Script Languages** - Write in Bash or Lua with built-in HTTP and JSON libraries
- **📊 Event Logging** - Track all webhook executions and responses
- **🔄 Self-Updater** - Built-in update mechanism for easy maintenance

## 🚀 Quick Start

### Prerequisites

- Go 1.21 or higher (for building from source)
- SQLite 3
- Bash or sh (for script execution)

### Installation

**Download Pre-built Binary:**

Visit the [releases page](https://github.com/rapidforge-io/rapidforge/releases) to download the latest binary for your platform.

**Or Build from Source:**

```bash
git clone https://github.com/rapidforge-io/rapidforge.git
cd rapidforge
go build -o rapidforge
```

### Running RapidForge

```bash
./rapidforge
```

By default, RapidForge starts on `http://localhost:8080`. Access the admin interface in your browser to get started.

### Creating Your First Webhook

1. Navigate to **Blocks** in the admin interface
2. Create a new **Webhook**
3. Write your script (Bash or Lua)
4. Configure the HTTP method and path
5. Save and test your endpoint

Example Bash webhook:

```bash
#!/bin/bash
echo '{"message": "Hello from RapidForge!", "timestamp": "'$(date -u +%Y-%m-%dT%H:%M:%SZ)'"}'
```

## 📖 Documentation

For detailed configuration, deployment guides, and API documentation, visit:

**[https://rapidforge.io/docs](https://rapidforge.io/docs)**

## 🛠️ Technology Stack

- **Backend:** Go with Gin framework
- **Database:** SQLite with migrations support
- **Frontend:** HTMX for interactivity, Shoelace web components
- **Editor:** CodeMirror for code editing
- **Visual Editor:** React-based drag-and-drop page builder

## 🔧 Configuration

RapidForge can be configured through environment variables:

- `RF_PORT` - Server port (default: 8080)
- `RF_ENV` - Environment mode: `development` or `production`
- `RF_DOMAIN` - Domain name for the application
- `HONEYBADGER_API_KEY` - (Optional) Error tracking API key
- `FEEDBACK_WEBHOOK_URL` - (Optional) Discord/Slack webhook for feedback

See [rapidforge.io/docs](https://rapidforge.io/docs) for complete configuration options.

## 🐳 Docker Deployment

```bash
docker build -t rapidforge .
docker run -p 8080:8080 -v $(pwd)/data:/data rapidforge
```

Or use with Fly.io (see `fly.toml` for configuration).

## 🤝 Contributing

We welcome contributions! Please see [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines on how to submit pull requests, report issues, and contribute to the project.

##  Release Process

Our release process ensures stability by testing RapidForge **with** RapidForge.

1.  **Code Merger**: Pull Requests are reviewed and merged into the `main` branch.
2.  **Staging Deployment**: The main branch is deployed to our internal test server.
3.  **Dogfooding & Testing**: We use this internal rapidforge instance to run integration tests and perform manual testing. We verify changes by using RapidForge to test RapidForge.
4.  **Release**: Once changes are verified and stable, we create a new release.

## 📜 License

RapidForge is licensed under the [Apache License 2.0](LICENSE.md).

```
Copyright 2023-2026 RapidForge

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0
```

## 🔒 Security

Please report security vulnerabilities to the security team. See [SECURITY.md](SECURITY.md) for details.

## 💬 Community & Support

- **Documentation:** [https://rapidforge.io/docs](https://rapidforge.io/docs)
- **Issues:** [GitHub Issues](https://github.com/rapidforge-io/rapidforge/issues)
- **Discussions:** [GitHub Discussions](https://github.com/rapidforge-io/rapidforge/discussions)

---

<p align="center">Made with ❤️ by the RapidForge team</p>