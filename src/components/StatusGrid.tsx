"use client";
import { motion } from "framer-motion";
import { StatusCard, Pill } from "@/components/status/StatusCard";

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.12 },
  },
};

const item = {
  hidden: { opacity: 0, y: 8 },
  show: { opacity: 1, y: 0 },
};

export function StatusGrid() {
  const batteryPct = 80;
  const lastTrack = "Unforgettable";
  const ageSeconds = 60_735_917;
  const daysToNext = 340;
  const fmt = new Intl.NumberFormat("en-US");

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="grid grid-cols-1 gap-5 sm:grid-cols-2"
    >
      <motion.div variants={item} className="col-span-1 aspect-square">
        <StatusCard tone="grey" className="h-full text-base md:text-lg">
          has <Pill className="ml-1 mr-2">{batteryPct}%</Pill> battery left
        </StatusCard>
      </motion.div>
      <motion.div variants={item} className="col-span-1 aspect-square">
        <StatusCard tone="grey" className="h-full text-base md:text-lg">
          was listening to
          <br />
          <Pill className="mt-1 inline-flex">{lastTrack}</Pill>
        </StatusCard>
      </motion.div>
      <motion.div variants={item} className="sm:col-span-2 h-[200px]">
        <StatusCard tone="grey" className="h-full text-base md:text-lg">
          is <Pill className="mx-2">{fmt.format(ageSeconds)}</Pill> seconds old! My next solar orbit is in
          <Pill className="mx-2">{daysToNext}</Pill> days
        </StatusCard>
      </motion.div>
    </motion.div>
  );
}

export default StatusGrid;
