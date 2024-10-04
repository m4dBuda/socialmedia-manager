# Social Media Hashtag Monitoring API

## 1. NoSQL Data Structure

The NoSQL data structure for this application is designed to store real-time tweets/social media posts containing a specified hashtag. The schema is flexible to integrate messages/comments from other platforms such as Facebook, Instagram, and YouTube.

The key fields stored in MongoDB for each tweet/post include:

```bash
text: Content of the tweet.
timestamp: Date and time the tweet was posted.
hashtags: Array of hashtags associated with the tweet.
user: Object representing the user who posted the tweet.
platform: Enum indicating the social media platform (initially "Twitter").
mediaUrl: Optional field for media links associated with the tweet.
comments: Array for comments associated with the tweet.
engagementMetrics: Optional field for tracking metrics (e.g., retweets, likes).
```

**Normalization Justification:**

The schema is normalized to allow integration of data from other platforms such as Facebook, Instagram, and YouTube, maintaining consistent data representation across various sources. Using structured entities for user, comments, and engagement metrics, it provides flexibility for future platform integrations.

## 2. Service for Monitoring Tweets

The SocialMediaPostService monitors tweets in real-time, specifically those containing a given hashtag. It validates, processes, and stores these tweets in the NoSQL database, ensuring the most recent 100,000 tweets are retained. Any older data is archived.

The service also continuously tracks tweet volume to detect anomalies, which could indicate trends, sudden events, or irregular activities.

Key functionalities include:

```bash
storeSocialMediaPost(data: Partial<SocialMediaPost>): Saves incoming tweets to the database.
archiveOldPosts(): Archives older posts once the tweet limit of 100,000 is reached.
monitorPostRate(): Monitors the tweet rate in real time and detects anomalies.
```

## 3. Anomaly Detection System

The AnomalyDetectionService monitors the volume of tweets in real-time, focusing on significant changes in the tweet rate that could signal unusual behavior. This functionality helps detect unexpected spikes or declines, which could provide valuable business insights such as trending topics or emerging crises.

Key Components and Functionality:

Time Window: The system analyzes tweets over a configurable 10-minute window to identify rate changes.
Dynamic Threshold: Anomalies are flagged based on a dynamic threshold, starting with a default 50% change. The threshold adjusts based on the average post rate:

- 75% if the rate exceeds 1,000 tweets.
- 30% if the rate drops below 100 tweets.

Anomaly Types:

- Rate Change: A sharp increase in tweet volume.
- Hashtag Spike: An unusual rise in the number of distinct hashtags (50 or more).
- User Activity Spike: More than 20 tweets from a single user in a window.
- Platform Activity Spike: A single platform producing more than 50 tweets.
- Alerting Mechanism: When an anomaly is detected, the system generates an alert with details such as tweet rate, percentage change, and the nature of the anomaly. The alerts can later be expanded to trigger business actions such as notifications to internal teams.

## 4. Testing

For this project, testing focused on the core feature: the AnomalyDetectionService. This service ensures accurate detection of unusual activity in tweet rates, which is crucial for identifying trends or irregularities in real-time.

The unit tests validate different anomaly scenarios, including rate spikes and user activity anomalies, ensuring the system responds accurately under varied conditions.

## 6. Observations

Due to the unavailability of Twitter's API in Brazil, I developed a custom data stream simulator that mimics Twitter data for the purpose of this assessment. This simulator feeds mock tweet data into the system, enabling the real-time monitoring and anomaly detection services to function as required for the assignment.

## 7. Trigger for Stream Data Simulator

A prompt has been added to the API that asks whether the user wants to activate the stream data simulator. This allows for simulating tweet data in real-time during development or testing, ensuring the system works without direct access to Twitter's live API.

## 8. Swagger Documentation

API documentation is available via Swagger at the /api route.

## Installation and Running Guide

Follow these steps to clone, install, and run the API:

### Prerequisites

Ensure you have the following installed on your machine:

Docker: Install Docker to manage containers for running MongoDB. You can download Docker from [Docker's official website.](https://www.docker.com/)
Node.js version 20.1 or higher. Check your Node.js version by running:

```bash
node -v
```

First, clone the repository to your local machine using the following command:

```bash
git clone <repository-url>
```

> Replace <repository-url> with the URL of this repository.

Navigate to the API Folder
Change your current directory to the API folder:

```bash
cd <api-folder-path>
```

> Replace <api-folder-path> with the path to the API folder in the cloned repository.

Install the project dependencies by running:

```bash
npm install
```

### Database

Configure the environment variables according to the database credentials specified in the docker-compose file.

Start the database container using Docker Compose:

```bash
docker compose up -d
```

### Running

To start the API in development mode:

```bash
npm run start:dev
```

Now, the API should be running and ready for use.
You can see and try the requests using the [Swagger Documentation](http://localhost:3000/swagger)

## Test

```bash
# unit tests
$ npm run test
```

## Developer

- [João Otávio Carvalho Castejon](https://www.linkedin.com/in/jo%C3%A3o-ot%C3%A1vio-carvalho-castejon-164023151/) - SWE
