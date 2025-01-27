// Desc: unit tests for the adaptor module
import { expect } from 'chai';
import 'mocha';
import { isMidiMessageInteresting } from '../../src/midiUtils';
import { DecodedMidiMessage, MidiMessageType } from '../../types/midiMessages.spec';


describe('isMidiMessageInteresting', () => {

    const interestingChannels = [1, 2, 3];
    const interestingTypes = ['noteOn', 'noteOff'];

    const tests: {
        desc: string;
        message: DecodedMidiMessage;
        expected: boolean
    }[] = [
        {
            desc: 'should return true if channel and type are interesting',
            message: { channel: 1, messageType: MidiMessageType.NoteOn, data0: 60, data1: 100 },
            expected: true
        },
        {
            desc: 'should return false if channel is not interesting',
            message: { channel: 4, messageType: MidiMessageType.NoteOn, data0: 60, data1: 100 },
            expected: false
        },
        {
            desc: 'should return false if type is not interesting',
            message: { channel: 1, messageType: MidiMessageType.ControlChange, data0: 60, data1: 100  },
            expected: false
        },
        {
            desc: 'should return false if neither channel nor type are interesting',
            message: { channel: 4, messageType: MidiMessageType.ControlChange, data0: 60, data1: 100 },
            expected: false
        }
    ]

    tests.forEach(({ desc, message, expected }) => {
        it(desc, () => {
            const result = isMidiMessageInteresting(message, interestingChannels, interestingTypes);
            expect(result).to.eql(expected)
        });
    });

});