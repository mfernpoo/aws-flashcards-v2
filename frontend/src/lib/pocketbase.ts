import PocketBase from 'pocketbase';

// In production (Docker Swarm), the API is at the same host but different path/port or subdomain.
// Since we used Traefik with `api.flashcards.home.arpa`, we should point there.
// However, for local dev, it might be localhost:8090.
// Best practice: Use an environment variable or relative path if proxied.

const PB_URL = import.meta.env.VITE_POCKETBASE_URL || '/'; 
// If '/' is used, we assume Nginx proxies /api/ to PocketBase, which we didn't set up in swarm yet.
// Given the swarm config uses a separate subdomain `api.flashcards.home.arpa`, we should default to that or let the user configure it.

// For now, let's use a flexible approach.
export const pb = new PocketBase(PB_URL);

// Helper to get the typed collection
export const getCardsCollection = () => pb.collection('cards');
