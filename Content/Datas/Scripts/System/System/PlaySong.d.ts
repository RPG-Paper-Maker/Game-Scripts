import { Base } from "./Base";
import { Enum } from "../Common";
import SongKind = Enum.SongKind;
import { System } from "..";
/** @class
 *  A way to play a song.
 *  @extends System.Base
 *  @param {SongKind} kind The kind of song to play
 *  @param {Record<string, any>} [json=undefined] Json object describing the
 *  play song
 */
declare class PlaySong extends Base {
    static previousMusic: PlaySong;
    static currentPlayingMusic: PlaySong;
    kind: SongKind;
    songID: System.DynamicValue;
    volume: System.DynamicValue;
    isStart: boolean;
    start: System.DynamicValue;
    isEnd: boolean;
    end: System.DynamicValue;
    constructor(kind: SongKind, json?: Record<string, any>);
    /**
     *  Read the JSON associated to the play song.
     *  @param {Record<string, any>} json Json object describing the play song
     */
    read(json: Record<string, any>): void;
    /**
     *  Set song play to default values.
     */
    setDefault(): void;
    /**
     *  Initialize (for music effects).
     */
    initialize(): {
        parallel: boolean;
        timeStop: number;
    };
    /**
     *  Update all the specified values.
     *  @param {System.DynamicValue} songID The song ID
     *  @param {System.DynamicValue} volume The volume to play
     *  @param {boolean} isStart Indicate if there's a start value
     *  @param {System.DynamicValue} start The start of the song to play
     *  @param {boolean} isEnd Indicate if there's a end value
     *  @param {System.DynamicValue} end The end of the song to play
     */
    updateValues(songID: System.DynamicValue, volume: System.DynamicValue, isStart: boolean, start: System.DynamicValue, isEnd: boolean, end: System.DynamicValue): void;
    /**
     *  Play the music.
     *  @param {number} [start=undefined] The start of the song to play
     *  @param {number} [volume=undefined] The volume to play
     */
    playMusic(start?: number, volume?: number): number;
    /**
     *  Play the sound.
     */
    playSound(): void;
    /**
     *  Play the music effect and return the next node value.
     *  @param {Record<string, any>} currentState The current state of the
     *  playing music effect
     *  @returns {number}
     */
    playMusicEffect(currentState: Record<string, any>): number;
}
export { PlaySong };
