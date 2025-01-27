import { MidiMessage } from 'midi';
import { ChangeControlMap, DecodedMidiMessage, MidiMessageType, MidiStatusMessage } from '../types/midiMessages.spec';
import { decorateSysexMessage } from './midiUtils';
import { memoize }  from 'lodash';

export const transformMessage = memoize(
    (
        { messageType, data0, data1 }: DecodedMidiMessage,
        rawMessage: MidiMessage,
        changeControlMaps: ChangeControlMap[]
    ): MidiStatusMessage => {

        if (messageType === MidiMessageType.ControlChange) return transformCCMessage(data0, data1, changeControlMaps);
        return rawMessage;
    },
    ({ messageType, data0, data1 }) => `${messageType}-${data0}-${data1}`
);


export function transformCCMessage(
    data0: number,
    data1: number,
    changeControlMaps: ChangeControlMap[]
): MidiStatusMessage {

    const targetMap: ChangeControlMap | undefined = changeControlMaps.find((map) => {return (map.ccNum === data0)})

    if (!targetMap) return []

    return decorateZoomSysexMessageForPedalParams(targetMap.effectPosition, targetMap.effectInternalRef, data1)
        
}

export function transformCCMessageWorking(
    data0: number,
    data1: number
): MidiStatusMessage {

    const pitchShiftEffectPosition = 0x01

    switch (data0) {
        // cc 0 is pitch shift on/off
        case 0:
            console.log('Setting pitch shift on/off to ', data1)
            return decorateZoomSysexMessageForPedalParams(pitchShiftEffectPosition, 0x00, data1)
        // cc 1 sets the pitch shift amount
        case 1:
            console.log('Setting pitch shift amount to ', data1)
            return decorateZoomSysexMessageForPedalParams(pitchShiftEffectPosition, 0x02, data1)
        // cc 2 sets the pitch shift balance
        case 2:
            console.log('Setting pitch shift balance to ', data1)
            return decorateZoomSysexMessageForPedalParams(pitchShiftEffectPosition, 0x04, data1)
        default:
            return []
    }
}

export function decorateZoomSysexMessageForPedalParams(
    effectPosition: number,
    effectCCNum: number,
    data: number
): MidiStatusMessage {
    return decorateSysexMessage([0x52, 0x00, 0x58, 0x31, effectPosition, effectCCNum, data, 0x00])
}