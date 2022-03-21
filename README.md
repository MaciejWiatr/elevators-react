# Elevator system simulator

This repository contains elevator system simulator created in React+Typescript with Vite as a main build tool

## Authors

-   Maciej Wiatr https://www.linkedin.com/in/maciej-wiatr/

## Demo

You can find live version here:

https://elevators-react.vercel.app/

## How to run locally

Install my-project with npm or pnpm

### Requirements:

-   Node.js
-   NPM or PNPM

Clone repo

```bash
git clone git@github.com:MaciejWiatr/elevators-react.git
```

Change directory to elevators-react

```bash
cd elevators-react
```

Install dependencies

```bash
npm install
```

Run dev server

```bash
npm run dev
```

_And website should be available on localhost:3000_

---

**If you'd like to run tests use following command**

```
npm run test
```

## Documentation

Main algorithm file is located in

```
/src/ElevatorSystem/ElevatorSystem.ts
```

ElevatorSystem exposes few functions that allow integration between frontend and the algorithm:

```typescript
// Registers new passenger to be picked up
pickup(originFloor: number, direction: number): void;

// Returns system status in form of array
status(): ElevatorDto[];

// Makes one simulation step
step(): void;

// Return current amount of passengers in elevator
getElevatorPickups(elevatorId: number): number;

// Return grouped list for pickups for given floor number
getFloorPickups(floorNumber: number): {
    up: PickupItem[];
    down: PickupItem[];
};
```

### How it works?

First of all let's explain what do we have here:

ElevatorSystem:

-   system that controls Elevators and pickup list and provides other parts of application with data from the elevators

Elevator Class (Elevator.ts):

-   Contains logic related to elevator itself, i.e. movement, loading new and dropping old passengers

Elevator Helpers (ElevatorHelpers.ts):

-   Provides helper functions for classes mentioned earlier

#### Algorithm itself

The algorithm is fairly simple, yet very fast (it handles 1024 pickups with 16 elevators under 100ms 😎)

It's inspired by the real elevator algorithm, thus it prefers going in the same direction as long as its possible

**Step by step Algorithm explanation:**

if the following image is not readable on your device you can find it also here:
https://i.imgur.com/PR1ix6F.png

![Elevator graph](https://i.imgur.com/PR1ix6F.png)

# Website explained

The website was created using React.js, TypeScript, Chakra UI and few other awesome tools. It enables visual interaction with my algorithm

**You can find its source code in the src/ folder**

![Website image](https://i.imgur.com/etTLNJ2.png)

## Left side

Left side represents current system status.

Each stripe represents one floor, it's limited to 15 floors however algorithm isn't therefore sometimes elevators might overflow visualisation,
it's completely normal as the website only visualizes algorithm in src/core/ElevatorSystem which can be completely decoupled and work on its own

**The number on the left side** of each stripe represents the floor number.

**The "Add passenger" button** invokes pickup method on Elevator system with origin floor set as clicked floor and random direction. It's disabled until simulation is started.

![Left side explained](https://i.imgur.com/t8kLR5d.png)

## Right side

**Editor:**
Sets initial data for the elevator system. The first input represents the number of elevators that will be simulated. Second one represents the number of randomly generated passengers that will be added before the simulation start.

Switch: If turned on, new random passengers will be added to the system each 300ms.

## Additional settings

**Add custom passenger button**: Enables you to add new passenger with custom data defined by you:
![Modal image](https://i.imgur.com/S99fbKa.png)

**Mood booster checkbox**: Just check it, trust me.

# That's all folks

Thanks for checking out my solution, I really hope you liked it :)

![Work](https://i.imgur.com/e76As9f.jpg)
