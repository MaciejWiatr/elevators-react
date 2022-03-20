import { PickupItem } from "./../core/ElevatorSystem/index";
import { groupBy } from "ramda";
export const groupByDirection = groupBy((pickup: PickupItem) => {
	return pickup[1] >= 0 ? "up" : "down";
});
