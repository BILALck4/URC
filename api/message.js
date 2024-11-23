import { checkSession, unauthorizedResponse } from "../lib/session.js";
import { sql } from "@vercel/postgres";



export default async function handler(request) {
    console.log("9lawiiiii");
    
    // Set CORS headers to allow requests from frontend
    const headers = {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*", // Allow all origins (can be restricted to specific domains)
        "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE", // Allow these HTTP methods
        "Access-Control-Allow-Headers": "Content-Type, Authorization", // Allow these headers
    };

    return new Response(
        JSON.stringify({ message: "API is working!" }),
        {
            status: 200,
            headers: headers,
        }
    );
}
