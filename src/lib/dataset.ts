import raw from "../../data/channels.json";
import type { BeaconData, ChannelDayRecord, ChannelKey } from "./dataset-types";

export const beaconData = raw as unknown as BeaconData;
export const channels = beaconData.channels;

export type {
  BeaconData,
  ChannelPerf,
  ChannelDayRecord,
  ChannelKey,
  Segment,
  SegmentKey,
  Competitor,
  Persona,
  BeaconMeta,
} from "./dataset-types";

// 90-day spend totals etc. for headline stats
export function totals90() {
  return channels.reduce(
    (acc, c) => ({
      spend: acc.spend + c.spend90,
      signups: acc.signups + c.signups90,
      qualified: acc.qualified + c.qualified90,
    }),
    { spend: 0, signups: 0, qualified: 0 },
  );
}
