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

export function decorateZoomSysexMessageForPedalParams(
    effectPosition: number,
    effectCCNum: number,
    data: number
): MidiStatusMessage {
    return decorateSysexMessage([0x52, 0x00, 0x58, 0x31, effectPosition, effectCCNum, data, 0x00])
}