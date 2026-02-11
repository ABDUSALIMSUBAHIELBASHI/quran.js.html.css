// Put this inside your <script type="module"> in index.html

import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-auth.js";

const auth = getAuth();

// This function watches for ANY login (Google or Email)
onAuthStateChanged(auth, async (user) => {
    if (user) {
        console.log("Full Action Started: Syncing user...");

        const userData = {
            fullName: user.displayName || "New User",
            email: user.email,
            authMethod: user.providerData[0]?.providerId || "password"
        };

        try {
            // SENDING TO YOUR SERVER RUNNING ON PORT 3000
            const response = await fetch('http://localhost:3000/api/users/sync', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(userData)
            });

            if (response.ok) {
                console.log("✅ Success: Data is now in MongoDB!");
                // Call your function to update the visible table on your page
                if (typeof fetchUsers === "function") fetchUsers();
            }
        } catch (err) {
            console.error("❌ Failed to sync with MongoDB. Is your terminal still running?");
        }
    }
});