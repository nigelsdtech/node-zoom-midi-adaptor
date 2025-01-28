import { MidiMessage } from "midi";
import { MidiMessageType, DecodedMidiMessage, MidiStatusMessage } from '../types/midiMessages.spec';
import { memoize } from 'lodash';

// Function that receives a number and parses it into a 
export function classifyMessageType(status: number): MidiMessageType {
    const messageType = status & 0xF0;
    switch (messageType) {
        case 0x80: return MidiMessageType.NoteOff;
        case 0x90: return MidiMessageType.NoteOn;
        case 0xA0: return MidiMessageType.PolyphonicKeyPressure;
        case 0xB0: return MidiMessageType.ControlChange;
        case 0xC0: return MidiMessageType.ProgramChange;
        case 0xD0: return MidiMessageType.ChannelPressure;
        case 0xE0: return MidiMessageType.PitchBend;
        case 0xF0: return MidiMessageType.SystemExclusive;
        default: return MidiMessageType.Other;
    }
}

// Process raw MIDI message into a structured format
export const decodeMidiMessage = memoize((rawMessage: MidiMessage): DecodedMidiMessage => {
    const [status, ...data] = rawMessage;

    const channel = status & 0x0F;
    const messageType = classifyMessageType(status);

    const [data0, ...data1] = data;

    return {
        channel,
        messageType,
        data0: data0,
        data1: data1 || 0
    };
});

export function decorateSysexMessage(data: number[]): MidiStatusMessage {
    return [0xF0, ...data, 0xF7]
}