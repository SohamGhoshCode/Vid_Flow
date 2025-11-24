#Stating a project on FullStack
##### PRE HOOK ######
<!-- Excellent 👏 — let’s dive into Mongoose pre hooks (also known as middleware) — they’re an important part of how Mongoose models work under the hood.
🧩 What is a Pre Hook?
A pre hook in Mongoose is a function that runs automatically before a specific event or operation happens on a document.
👉 It’s like saying:
“Before saving this user, do something first.”
🧠 Why We Use Pre Hooks
Pre hooks are used to automate tasks before performing an action like saving, updating, or removing a document.
Common use cases:
🔐 Hashing a password before saving a user.
🕒 Setting timestamps or modifying data before update.
📋 Validating or formatting data before insert. -->

<!-- Operation	When It Runs
save	Before a document is saved
validate	Before validation runs
remove	Before a document is removed
updateOne, findOneAndUpdate	Before update operations
deleteOne, findOneAndDelete	Before deletion
insertMany	Before inserting multiple documents -->


### JWT bearer TOKEN #####
<!-- Excellent 👏 — yes, JWT (JSON Web Token) is often used as a Bearer Token in web authentication — let’s break down how and why that works.
🔐 What Is a Bearer Token?
A Bearer Token is a type of access token that’s sent in the HTTP Authorization header when making requests to a protected route.
It’s called “Bearer” because whoever bears (holds) the token is considered authenticated.
🧩 What is JWT?
A JWT (JSON Web Token) is a string token created by the server to identify and authorize users securely.
It looks like this:
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.
eyJpZCI6IjEyMyIsInVzZXJuYW1lIjoiU29oYW0ifQ.
8fN3G6W47Vk3x3v5mQ1cH2eC6zUOxT9iJoDe1UaaMIU
JWTs are usually sent as Bearer tokens in the Authorization header.
⚙️ How JWT Becomes a Bearer Token (Step-by-Step)
🧾 1️⃣ User Logs In
User sends their credentials to your server:
POST /login
{
  "email": "soham@example.com",
  "password": "12345"
}
🔑 2️⃣ Server Verifies and Creates JWT
If credentials are correct, the backend creates a JWT using jsonwebtoken:
import jwt from "jsonwebtoken";

const token = jwt.sign(
  { id: user._id, email: user.email },   // payload
  "MY_SECRET_KEY",                      // secret key
  { expiresIn: "1h" }                   // expiration time
);
This JWT encodes user info securely and signs it so it can’t be tampered with.
📩 3️⃣ Server Sends JWT to Client
Server sends the token in the response:
res.json({ token });
💾 4️⃣ Client Stores JWT
Frontend (React, Angular, etc.) stores it safely, e.g. in:
localStorage
sessionStorage
Secure cookie
🚀 5️⃣ Client Sends JWT as Bearer Token
When the client makes a new request to a protected route, it sends the JWT in the header:
Authorization: Bearer <token>
Example using fetch:
fetch("/api/profile", {
  headers: {
    "Authorization": `Bearer ${token}`
  }
});
🧠 6️⃣ Server Verifies Token
Backend extracts and verifies the token using the same secret key:
import jwt from "jsonwebtoken";

app.get("/api/profile", (req, res) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "No token provided" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, "MY_SECRET_KEY"); // verify token
    req.user = decoded; // attach user info
    res.json({ message: "Access granted", user: decoded });
  } catch (err) {
    res.status(403).json({ message: "Invalid or expired token" });
  }
});
✅ If valid → user is authenticated.
❌ If invalid/expired → access denied.
📦 Why JWT as a Bearer Token?
Reason	Benefit
✅ Stateless	Server doesn’t need to store sessions — token itself has user info
🔐 Secure	Signed using secret key, can’t be modified
🌍 Portable	Works with APIs, mobile apps, or microservices easily
⏳ Expirable	You can set token lifetimes (e.g., 1 hour)
⚡ Fast	No database lookup on every request
🧾 Summary
Concept	Explanation
JWT	JSON Web Token, encodes user info securely
Bearer Token	A token sent in Authorization header with keyword Bearer
Header Format	Authorization: Bearer <token>
Purpose	To authenticate API requests
Server Verifies Using	jwt.verify(token, secretKey)
✅ In short:
A JWT becomes a Bearer Token when you send it inside the Authorization header with the word “Bearer” in front of it. -->


### Cloudinary ###
<!--cloudinary.v2.uploader
// .upload("dog.mp4", {
//   resource_type: "video", 
//   public_id: "my_dog",
//   overwrite: true, 
//   notification_url: "https://mysite.example.com/notify_endpoint"})
// .then(result=>console.log(result)); -->

### Sync vs Async ###
<!-- Concept	Meaning
Synchronous (non-async)	Tasks run one after another — each must finish before the next one starts.
Asynchronous (async)	Tasks can run independently — you don’t wait for one task to finish before starting another. -->

### HTTP vs HTTPS ### 
<!-- Term	Full Form
HTTP	HyperText Transfer Protocol
HTTPS	HyperText Transfer Protocol Secure
🔐 Main Difference
Feature	HTTP	HTTPS
Security	❌ Not secure — data sent in plain text	✅ Secure — data is encrypted
Encryption	No encryption	Uses SSL/TLS to encrypt data
Port	80	443
URL format	http://example.com	https://example.com
Data protection	Vulnerable to hackers (man-in-the-middle attacks)	Data is encrypted before sending
Certificate required?	No	Yes — needs an SSL certificate
Browser indicator	⚠️ “Not Secure” in modern browsers	🔒 Lock icon shown in browser -->

### URL vs URI vs URN ###
<!-- Concept	Stands For	Identifies Resource By	Example
URI	Uniform Resource Identifier	Name or location	https://example.com, urn:isbn:0451450523
URL	Uniform Resource Locator	Location (where)	https://example.com/page.html
URN	Uniform Resource Name	Name (what)	urn:isbn:0451450523
💡 Real-world analogy
Term	Analogy
URI	“Soham Ghosh” — identifies you
URL	“Soham lives at 123 Street, Kolkata” — where to find you
URN	“Aadhar Number 1234-5678-9000” — uniquely names you, not location -->

### Methods Of HTTP ###
<!-- Common HTTP Methods (with Examples)
Method	Meaning	Typical Use	Request Body?	Safe?	Idempotent?
GET	= Retrieve data	Fetch a webpage, list, or record	❌ No	✅ Yes	✅ Yes
POST	= Create new data	Submit a form, upload a file, add record	✅ Yes	❌ No	❌ No
PUT	= Replace entire resource	Update a record fully	✅ Yes	❌ No	✅ Yes
PATCH	= Partially update resource	Update one or more fields	✅ Yes	❌ No	❌/✅ (depends)
DELETE	= Remove resource	Delete a user, post, etc.	❌ Usually no	❌ No	✅ Yes
HEAD = Like GET but only headers	Check if resource exists	❌ No	✅ Yes	✅ Yes
OPTIONS	= Ask what methods are allowed	Used for CORS (preflight requests)	❌ No	✅ Yes	✅ Yes
CONNECT = Establish a tunnel	Used for proxy connections (rare)	❌ No	❌ No	❌ No
TRACE =	Debug request path	Echoes request for diagnostics (rare)	❌ No	✅ Yes	✅ Yes -->
 
### Status Code HTTP ###
<!-- HTTP Status Code Categories
There are 5 main classes of status codes, based on their first digit:
Range	Category	Meaning
1xx	Informational	Request received, still processing
2xx	Success	Request completed successfully
3xx	Redirection	Client must take additional action (redirect)
4xx	Client Error	Problem with the request (e.g., bad data, unauthorized)
5xx	Server Error	Server failed to fulfill a valid request -->


<!-- 🔹 1xx — Informational
Code	Meaning	Example Use
100 Continue	Server received request headers, waiting for body	Used in large uploads
101 Switching Protocols	Switching to another protocol	e.g., WebSocket upgrade
🔹 2xx — Success
Code	Meaning	Example
200 OK	Request succeeded	Standard success for GET/POST
201 Created	New resource created	After POSTing new user or file
202 Accepted	Request accepted but not yet processed	For async jobs
204 No Content	Request succeeded, no data returned	DELETE route success
🧠 Example:
res.status(201).send({ message: "User created" });
🔹 3xx — Redirection
Code	Meaning	Example
301 Moved Permanently	Resource moved to a new URL	SEO-friendly redirects
302 Found	Temporary redirect	
304 Not Modified	Cached version is still valid	Improves performance
🧠 Example: When you change /home → /dashboard, you can send a 301 redirect.
🔹 4xx — Client Errors
Code	Meaning	Example
400 Bad Request	Invalid input data	Missing required field
401 Unauthorized	No valid authentication	Missing or wrong token
403 Forbidden	User not allowed	Logged in but no permission
404 Not Found	Resource doesn’t exist	Wrong URL
405 Method Not Allowed	Wrong HTTP method used	POST instead of GET
409 Conflict	Resource conflict	Username/email already exists
422 Unprocessable Entity	Validation failed	Incorrect input format 
##500
500 -> Internal server error
501 -> Gateway time out
-->

### Utils ###
<!-- File	Purpose	Where to use
asyncHandler.js	Removes try/catch in controllers	Wrap controller functions
apiResponse.js	Standard structure for success responses	Return success JSON from controllers
apiError.js	Standard structure for error responses	Throw errors inside controllers -->

### Cloudinary ###
<!-- Part	Explanation
cloudinary.config()	Connect to Cloudinary account
uploadOnCloudinary()	Upload file to Cloudinary
localFilePath	Path to file uploaded by Multer
fs.unlinkSync()	Deletes local file after upload
resource_type: "auto"	Supports images, videos, docs -->

## DATA in ATLAS BSON DATA(_id) BSON = MongoDB’s internal language ## 
<!-- {"_id":{"$oid":"6919b755f4091ba14397f89e"},"username":"bittu","email":"soham@gmail.com","fullName":"sohamcode","avatar":"http://res.cloudinary.com/dkaonf9dl/image/upload/v1763293012/cxs9xfqc7dbtdci5uqfj.jpg","coverimage":"http://res.cloudinary.com/dkaonf9dl/image/upload/v1763293013/yuge39m6fdtocc8x83s5.jpg","watchhistory":[],"password":"$2b$10$hfR0u6XvyPJ/4WUmOK3MoOjhNdv1hF105W5AB0MtfN9NTkqQtnJwK","createdAt":{"$date":{"$numberLong":"1763293013758"}},"updatedAt":{"$date":{"$numberLong":"1763293013758"}},"__v":{"$numberInt":"0"}} -->

<!-- here the _id has bson data -> MongoDB automatically generates this 12-byte unique identifier for every document unless you manually set one.

what is bson data -> BSON stands for 👉 Binary JSON
It is the data format used internally by MongoDB to store documents.
🧠 Why BSON exists?
JSON is:
Easy to read
Text-based
BUT JSON cannot store:
❌ Binary data
❌ Dates
❌ ObjectId
❌ Efficient numeric formats
So MongoDB needed something faster and richer than JSON → BSON was created.
📌 BSON vs JSON
Feature	JSON	BSON
Format	Text	Binary
Speed	Slower to parse	FAST
Stores dates?	❌ No	✅ Yes
Stores binary data?	❌ No	✅ Yes
Data size	Smaller	Slightly larger
Used in MongoDB?	❌ No	✔️ Internally

🧩 BSON special types
Type	Example
ObjectId	ObjectId("...")
Date	{"$date": 1730000000000}
Binary	{"$binary": "...=="}
Decimal128	"{$numberDecimal": "1.234"} -->


## req.file ##
<!-- File	Size (bytes)	Size (approx) 
avatar	4294327	4.29 MB
coverimage	143499	143 KB -->

### Auth.Middleware ###

<!-- 🟢 Final Summary
Piece	Meaning
req.cookies?.accessToken	Reads token stored inside browser cookies
req.header("Authorization")	Reads token sent in request headers
.replace("Bearer","")	Removes the "Bearer" prefix
`	
asyncHandler	Handles async errors without try/catch -->

### AccessToken vs RefreshToken ###
<!-- 🎯 Access Token — Short Summary
✔ A short-lived token
✔ Used to access protected routes (/profile, /dashboard, /videos)
✔ Usually expires in 5–15 minutes
✔ Sent by the user with every request
💡 Think of it like:
👉 Your ID card shown at every gate to enter.
🎯 Refresh Token — Short Summary
✔ A long-lived token
✔ Used only to generate a new access token
✔ Stored securely (in cookies or DB)
✔ Usually expires in 7 days / 30 days / 1 year
💡 Think of it like:
👉 Your ID card renewal slip that gives you a new ID card if it expires.
🔥 Why do we need two tokens?
❌ Problem if only one token existed:
If your main token lasts 1 year, and someone steals it → your account is hacked for 1 year.
✔ Solution:
Use short access token + long refresh token.
Flow:
Access Token expires quickly → less risk
Refresh Token stays longer → you can stay logged in
When access token expires → client sends refresh token to get a new one
User does not need to log in again
🔥 Real-life Example
User logs in
Server creates:
🔹 accessToken (valid 15 minutes)
🔹 refreshToken (valid 7 days)
Stored like this:
Token Type	Stored In	Lifetime	Purpose
Access Token	browser (memory), request header	15 min	Authorization
Refresh Token	HTTP-only cookie	7 days	Create new access token -->

### 
