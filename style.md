/* STREAMING_CHUNK:Defining animations and component styles... */

/* Pulse Animation for Heart elements */
.anatomical-heart-pulse {
    animation: heartBeat 1.4s cubic-bezier(0.215, 0.61, 0.355, 1) infinite;
    transform-origin: center center;
}

@keyframes heartBeat {
    0% { transform: scale(1); }
    14% { transform: scale(1.08); }
    28% { transform: scale(0.98); }
    42% { transform: scale(1.05); }
    56% { transform: scale(1); }
    100% { transform: scale(1); }
}

/* Dripping Animation for Logo Drops */
.drip-drop {
    animation: drip 2s infinite ease-in-out;
}

.drip-drop-delay {
    animation: drip 2s infinite ease-in-out 0.6s;
}

@keyframes drip {
    0%, 100% { transform: translateY(0) scale(1); opacity: 0.9; }
    50% { transform: translateY(3px) scale(1.1); opacity: 1; }
}

/* Dynamic chart fill transition */
.chart-bar-fill {
    transition: width 1s ease-out;
}