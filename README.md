# Denti Bridge

Denti Bridge is a common platform designed to facilitate communication between dentists and lab vendors, streamlining their interactions and enhancing efficiency.

## Tech Stack

- Frontend: NodeJs, ExpressJS
- Additional Tools: Amazon S3, Winston, JWT

## Local Setup

Follow these steps to set up the project locally:

1. Clone the repository:

```bash
git clone https://github.com/pesto-students/front-end-repo-code-crusaders.git
```
```bash
cd front-end-repo-code-crusaders/
npm install
cp .env.example .env
```
## Configuration

### Environment Variables

Edit the `.env` file to configure the following environment variables:

- **API_KEY:** Your API key for authentication.
- **DATABASE_URL:** The URL for connecting to the database.
- **AWS_ACCESS_KEY_ID:** Access key ID for Amazon S3.
- **AWS_SECRET_ACCESS_KEY:** Secret access key for Amazon S3.
- **JWT_SECRET:** Secret key for JWT token generation.

## Running the Application with Configuration

After configuring the environment variables, start the application locally with:

```
npm run dev
```
or for production
```
npm run start
```

## License
This project is licensed under the `[MIT License]`.



