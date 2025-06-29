import { MidiMessage } from 'midi';
import { createInputStream } from './midiListener';
import { decodeMidiStatusMessage } from './midiUtils';
import { ZoomHandler } from './zoomAdaptor/zoomHandler';
import * as fs from 'fs';
import * as path from 'path';

// Load configuration from JSON file
const configPath = path.join(__dirname, `../../config/${process.env.CONFIG_FILE ?? 'default.json'}`);
const configData = fs.readFileSync(configPath, 'utf8');
const config = JSON.parse(configData);

// Main application entry point
export function main() {
    try {
        const interestingChannel = config.targetOutputDeviceChannel - 1; // Convert to zero-based index

        // Initialize the Zoom handler
        const zoomHandler = new ZoomHandler(config.targetOutputDevice, config.changeControlMaps);

        // Start listening for MIDI messages
        createInputStream(config.targetInputDevices, (rawMessage: MidiMessage) => {
            const decodedMessage = decodeMidiStatusMessage(rawMessage);
            console.log('Received message:', JSON.stringify(decodedMessage));

            // Only process messages on the specified channel
            if (decodedMessage.channel !== interestingChannel) return;

            // Pass the message to the Zoom handler
            zoomHandler.handleMessage(rawMessage);
        });
    } catch (error) {
        console.error('MIDI Router failed:', error);
        process.exit(1);
    }
}
