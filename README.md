# 🚆 Railway Ticketing System

A full-stack, type-safe Monorepo designed for railway ticketing operations. This project demonstrates a **Contract-First** approach to system design, ensuring that the Frontend and Backend are always in sync through a shared SDK. UI Inspired by https://booking.uz.gov.ua/.

## 🏗️ System Overview
The system is built on three core pillars:
1. **Contract-Driven Development:** Shared Zod schemas ensure data integrity from the Frontend form to the DynamoDB tables.
2. **Infrastructure as Code (IaC):** The entire AWS environment (API Gateway, Lambdas, DynamoDB) is defined via **AWS CDK**, making the infrastructure versionable and reproducible.
3. **Onion Architecture:** A clean separation between infrastructure (Middy/API Gateway) and business logic (Core services).

---

## 📂 Project Structure

| Package | Purpose | Documentation |
| :--- | :--- | :--- |
| **`sdk/`** | **The Single Source of Truth.** Shared Types, Zod Schemas, and API models. | [SDK README](./sdk/README.md) |
| **`backend/`** | **The Engine.** AWS CDK infrastructure and Lambda business logic. | [Architecture Doc](./backend/architecture.md) |
| **`frontend/`** | **The Consumer.** Next.js application that "snaps" onto the SDK. | - |
| **`docs/`** | **The Blueprints.** System diagrams and architecture assets. | - |

---

## 🛠️ The Tech Stack
* **Language:** TypeScript (Strict Mode)
* **Validation:** Zod (Runtime validation & Type inference)
* **Infrastructure:** AWS CDK (Lambda, DynamoDB, API Gateway)
* **Middleware:** Middy.js (Request/Response orchestration)
* **Frontend:** React / Next.js
* **Tooling:** Monorepo (NPM Workspaces)

---

## 🚀 Getting Started

### 1. Install & Build SDK
The system requires the SDK to be built first, as both the Frontend and Backend depend on its compiled types.
```bash
npm install
cd sdk && npm run build
```

### 2. Infrastructure Deployment
The backend is powered by AWS CDK. Ensure you have the AWS CLI configured before deploying.
```bash
cd backend
npx cdk bootstrap # Only required for first-time AWS setup
npx cdk deploy
```

### 3. Run the App
```bash
cd frontend
npm run dev
```

### ⚠️ Project Scope & Demo Notice
This repository is a technical demonstration focused on architecture and type-safety.

**Deployment**: Optimized for local development and CDK-sandbox deployments; production-grade CI/CD pipelines are out of scope.

**Viewport**: Designed for Desktop viewing only. A special `DemoWrapper` on frontend ensures that UI is rendered correctly. If viewed on a smaller screen, the app will prompt for a desktop-class breakpoint to maintain legibility.

### 💎 Key Engineering Highlights
**Zero Type Drift**: Because the Frontend and Backend share the same SDK, a breaking change in the database schema is caught at compile-time in the UI.

**Standardized Errors**: A custom Middleware pipeline ensures every error—from a 400 validation error to a 500 crash—follows a predictable JSON format.

**Atomic Intent**: The architecture is managed across multiple DynamoDB tables, ensuring a clear separation between train inventory and user booking records.

**Scalable Operations**: Each CRUD operation is isolated in its own Lambda function, allowing for granular scaling and independent permission sets.

### 🎨 Frontend Implementation
While the backend handles the heavy lifting, the Frontend (Next.js) acts as a high-performance Thin Client:

**UI Library**: Built with Shadcn UI and Tailwind CSS, leveraging a "Headless" component philosophy for maximum accessibility, speed and consistent design system.

**Responsive Guard**: Uses a `DemoWrapper` and custom `useBreakpoint` hook to enforce desktop-class layouts, ensuring the station board remains legible and "in-theme."

**Zod-Powered Prop Types**: Component props are directly inferred from the SDK, creating a compile-time link between the API response and the UI.
