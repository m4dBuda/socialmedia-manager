# Social Media Hashtag Monitoring API

## 1. NoSQL Data Structure

Define and Implement NoSQL Data Structure:

The NoSQL data structure for the application utilizes a document-oriented schema designed to store social media posts within a MongoDB database. Each SocialMediaPostDocument contains the following fields:

```bash
text: The content of the post.
timestamp: The date and time when the post was created.
hashtags: An array of hashtags associated with the post.
user: An object representing the user who created the post, leveraging the User entity for structured user information.
platform: An enumerated type indicating the social media platform (e.g., Twitter, Facebook) from which the post originated.
mediaUrl: An optional field for any media links associated with the post.
comments: An array of comments associated with the post, represented by the PostComment entity, allowing for user interactions.
engagementMetrics: An optional field that tracks engagement metrics associated with the post, represented by the EngagementMetrics entity.
```

**Normalization Justification:**

The schema is normalized to accommodate data from various social media platforms, allowing for easy integration of messages and comments from different sources. By using structured entities like `User`, `PostComment`, and `EngagementMetrics`, the design maintains data integrity while providing flexibility for future expansions. This ensures that as additional platforms are integrated, their data can fit seamlessly into the existing structure.

## 2. Service for Monitoring Tweets

The SocialMediaPostService manages the incoming posts, validating and storing them in the NoSQL database. When a new post is received, it is checked against the limit of 100,000 posts. If the limit is reached, older posts are archived to maintain performance and storage efficiency.
The service also continuously monitors the incoming post rate to detect anomalies.

Key functionalities of the service include:

```bash
storeSocialMediaPost(data: Partial<SocialMediaPost>): Saves the incoming post to the database.
archiveOldPosts(): Removes the oldest post when the maximum limit is reached.
monitorPostRate(): Tracks the rate of incoming posts to identify any anomalies based on pre-defined criteria.
```

## 3. Anomaly Detection System

The AnomalyDetectionService is designed to monitor social media posts in real-time, identifying significant variations in posting activity that may indicate anomalies. The service analyzes the volume of posts within a defined time window, checking for spikes that could suggest unusual behavior or trends. This would be a great feature to implement observability in the future and to store useful data for analisys which could lead to great marketing and strategy insights.

**Key Components and Functionality**

Time Window for Analysis:

- The service operates over a 10-minute window, which is configurable. During this period, it gathers data on the number of posts made.

Dynamic Threshold for Anomalies:

A default threshold of 50% change is established to detect anomalies. This threshold can dynamically adjust based on average post rates:

- If the average post rate exceeds 1000 posts, the threshold is increased to 75%.
- Conversely, if the average rate falls below 100, the threshold is reduced to 30%.

Anomalies are detected through a combination of:

- Rate Change: The service tracks the change in the post rate between consecutive intervals. If the change exceeds the current threshold, an anomaly is flagged.
- Hashtag Spike: A significant increase in the diversity of hashtags used (more than 50 unique hashtags in the time window) triggers an alert.
- User Activity Spike: If any user contributes more than 20 posts in the timeframe, it is considered an anomaly.
- Platform Activity Spike: If a single platform accounts for more than 50 posts, this indicates unusual activity.

Alerting Mechanism:

When an anomaly is detected, the service generates an alert containing:

- The current and previous post rates.
- The total number of posts within the current window.
- The percentage change in post rate.
- A detailed description of the detected anomalies.
- An alert level indicating the severity of the anomaly (Critical, High, Warning, Info).

Alerts and anomaly details are logged using NestJS's built-in logging functionality, enabling easy tracking and monitoring of the system's behavior.

We could expand this feature functionality to trigger any kind of communication process with a client or a internal team, generate some heatmap graphs and related stuff.

## 4. Testing

<!-- TODO: Fill this part after finishing the unit test -->

## 5. Time Tracking

The following time was logged for the various tasks:

```bash
Creating the project and first infrastructure configurations: 1 hour
Defining NoSQL Structure: 2 hours
Implementing the Service and the stream simulator: 1 and a half hour
Anomaly Detection System: 1 hour
Writing Tests: 40 minutes
Documentation and Final Touches: 1 hour
```

## 6. Observations

Since Im in Brazil, I couldnt have access to the Twitter ( or X ) API, not even their documentation, and because of that I had to create a data stream simulator to provide some data for the social-media-post.service.ts to process.

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

- [João Otávio Carvalho Castejon](https://www.linkedin.com/in/jo%C3%A3o-ot%C3%A1vio-carvalho-castejon-164023151/) - Backend Engineer
