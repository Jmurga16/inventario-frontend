import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class RateLimiterService {
    private attempts: Map<string, number[]> = new Map();


    isAllowed(key: string, maxAttempts: number = 5, windowMs: number = 60000): boolean {
        const now = Date.now();
        const attempts = this.attempts.get(key) || [];

        const recentAttempts = attempts.filter(timestamp => now - timestamp < windowMs);

        if (recentAttempts.length >= maxAttempts) {
            return false;
        }

        recentAttempts.push(now);
        this.attempts.set(key, recentAttempts);

        return true;
    }

    getTimeUntilRetry(key: string, windowMs: number = 60000): number {
        const now = Date.now();
        const attempts = this.attempts.get(key) || [];

        if (attempts.length === 0) {
            return 0;
        }

        const oldestAttempt = Math.min(...attempts);
        const timeElapsed = now - oldestAttempt;
        const timeRemaining = windowMs - timeElapsed;

        return timeRemaining > 0 ? timeRemaining : 0;
    }

    reset(key: string): void {
        this.attempts.delete(key);
    }

    clearAll(): void {
        this.attempts.clear();
    }
}
