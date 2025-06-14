import json
from typing import Optional
import httpx
from config.settings import settings

# Global client for Ollama API
client = None

async def initialize_llm():
    """Initialize LLM services."""
    global client
    client = httpx.AsyncClient(
        base_url=f"http://{settings.OLLAMA_HOST}:{settings.OLLAMA_PORT}"
    )

async def cleanup_llm():
    """Cleanup LLM services."""
    global client
    if client:
        await client.aclose()
        client = None

async def generate_llm_response(prompt: str, user_id: str) -> str:
    """Generate a response using the LLM."""
    if not client:
        print("Error: LLM client is not initialized")
        return "Error: LLM service is not initialized"
    
    try:
        print(f"Sending request to Ollama for user {user_id}: {prompt[:50]}...")
        
        # Use llama3 as the default model
        response = await client.post(
            "/api/generate",
            json={
                "model": "llama3",
                "prompt": prompt,
                "stream": False,
                "options": {
                    "temperature": 0.7,
                    "num_predict": 150  # Limit response length for faster generation
                }
            },
            timeout=120.0  # Increased timeout for first model load
        )
        
        print(f"Ollama response status: {response.status_code}")
        
        if response.status_code != 200:
            print(f"Ollama error response: {response.text}")
            return f"Error: Ollama returned status {response.status_code}"
        
        response.raise_for_status()
        result = response.json()
        print(f"Ollama response: {result}")
        
        return result.get("response", "No response field in Ollama output")
        
    except httpx.TimeoutException:
        print("Timeout waiting for Ollama response")
        return "The model is starting up. Please try again in a moment."
    except Exception as e:
        print(f"Error generating LLM response: {e}")
        print(f"Error type: {type(e)}")
        return "I apologize, but I'm having trouble generating a response right now. Please try again later." 