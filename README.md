# SpaceInvaders

## Structure of the project

```txt
space-invaders/
├── index.html
├── styles/
│   └── main.css
├── src/
│   ├── game.js
│   ├── objects/
│   │   ├── gameObject.js
│   │   ├── player.js
│   │   ├── enemy.js
│   │   ├── enemyFormation.js
│   │   └── projectile.js
│   └── utils/
│       └── collision.js
└── assets/
    └── sprites/
```

## API

Go API service that allows saving the data from the game in JSON format
The API accepts POST and GET requests from the client side for the scoreboard data

### Security

Security Headers: Protects against various web vulnerabilities.
Rate Limiting: Prevents abuse by limiting the number of requests from a single client.
Logging: Provides visibility into incoming requests for monitoring and debugging.
CORS: Manages cross-origin requests, allowing or restricting access as needed.

Details

Security Headers Middleware

protection against:
- X-Content-Type-Options: Prevents browsers from MIME-sniffing a response away from the declared content type.
- X-Frame-Options: Prevents the page from being displayed in a frame, mitigating clickjacking attacks.
- X-XSS-Protection: Enables the Cross-Site Scripting (XSS) filter in browsers.
- Content-Security-Policy: Restricts the sources from which content can be loaded, reducing the risk of XSS attacks.

Rate Limiting Middleware

Implements a simple rate limiting mechanism based on the client's IP address. It keeps track of the number of requests made by each IP address and limits them to 100 requests.

Logging Middleware

Logs incoming HTTP requests. It records the HTTP method (e.g., GET, POST) and the requested URL.

CORS Middleware

Handles Cross-Origin Resource Sharing (CORS) by setting the appropriate headers. It allows requests from any origin (using *), which can be adjusted for more restrictive policies. It also specifies which HTTP methods are allowed.
