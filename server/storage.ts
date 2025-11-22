import { type Attack, type InsertAttack } from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  getAllAttacks(filters?: AttackFilters): Promise<Attack[]>;
  getAttackById(id: string): Promise<Attack | undefined>;
  getStats(): Promise<Stats>;
}

export interface AttackFilters {
  dateFrom?: string;
  dateTo?: string;
  countries?: string[];
  regions?: string[];
  attackTypes?: string[];
  severities?: string[];
  casualtyMin?: number;
  casualtyMax?: number;
  searchQuery?: string;
}

export interface Stats {
  totalAttacks: number;
  totalKilled: number;
  totalWounded: number;
  topRegion: string;
  topCountry: string;
  topAttackType: string;
}

export class MemStorage implements IStorage {
  private attacks: Map<string, Attack>;

  constructor() {
    this.attacks = new Map();
    this.seedData();
  }

  private seedData() {
    const sampleAttacks: Omit<Attack, "id">[] = [
      {
        date: "2023-08-15",
        city: "Kabul",
        country: "Afghanistan",
        region: "South Asia",
        latitude: 34.5553,
        longitude: 69.2075,
        attackType: "Suicide Bombing",
        killed: 45,
        wounded: 78,
        description: "Suicide bombing targeting a crowded market area during peak hours, resulting in significant casualties among civilians.",
        severity: "Critical",
      },
      {
        date: "2022-03-22",
        city: "Baghdad",
        country: "Iraq",
        region: "Middle East",
        latitude: 33.3152,
        longitude: 44.3661,
        attackType: "Car Bomb",
        killed: 32,
        wounded: 65,
        description: "Car bomb explosion near a government building, causing extensive damage and numerous casualties.",
        severity: "High",
      },
      {
        date: "2021-11-08",
        city: "Mogadishu",
        country: "Somalia",
        region: "East Africa",
        latitude: 2.0469,
        longitude: 45.3182,
        attackType: "Armed Assault",
        killed: 18,
        wounded: 34,
        description: "Armed militants stormed a hotel, engaging in prolonged firefight with security forces.",
        severity: "High",
      },
      {
        date: "2023-05-12",
        city: "Damascus",
        country: "Syria",
        region: "Middle East",
        latitude: 33.5138,
        longitude: 36.2765,
        attackType: "Mortar Attack",
        killed: 8,
        wounded: 23,
        description: "Multiple mortar shells landed in residential areas, causing civilian casualties.",
        severity: "Medium",
      },
      {
        date: "2022-09-30",
        city: "Peshawar",
        country: "Pakistan",
        region: "South Asia",
        latitude: 34.0151,
        longitude: 71.5249,
        attackType: "Suicide Bombing",
        killed: 52,
        wounded: 95,
        description: "Suicide bomber detonated explosives at a mosque during Friday prayers, resulting in mass casualties.",
        severity: "Critical",
      },
      {
        date: "2021-07-19",
        city: "Maiduguri",
        country: "Nigeria",
        region: "West Africa",
        latitude: 11.8333,
        longitude: 13.1500,
        attackType: "Armed Assault",
        killed: 12,
        wounded: 28,
        description: "Militants attacked a village, killing civilians and burning homes.",
        severity: "High",
      },
      {
        date: "2023-02-05",
        city: "Sana'a",
        country: "Yemen",
        region: "Middle East",
        latitude: 15.5527,
        longitude: 44.2075,
        attackType: "Airstrike",
        killed: 25,
        wounded: 47,
        description: "Airstrike hit a civilian area, causing significant casualties and property damage.",
        severity: "High",
      },
      {
        date: "2022-06-14",
        city: "Goma",
        country: "Democratic Republic of Congo",
        region: "Central Africa",
        latitude: -1.6740,
        longitude: 29.2228,
        attackType: "Armed Assault",
        killed: 15,
        wounded: 31,
        description: "Armed group attacked a displacement camp, targeting civilians.",
        severity: "High",
      },
      {
        date: "2021-12-28",
        city: "Jalalabad",
        country: "Afghanistan",
        region: "South Asia",
        latitude: 34.4282,
        longitude: 70.4495,
        attackType: "IED",
        killed: 9,
        wounded: 19,
        description: "Improvised explosive device detonated near a police checkpoint.",
        severity: "Medium",
      },
      {
        date: "2023-10-03",
        city: "Nairobi",
        country: "Kenya",
        region: "East Africa",
        latitude: -1.2864,
        longitude: 36.8172,
        attackType: "Grenade Attack",
        killed: 5,
        wounded: 18,
        description: "Grenade thrown into a crowded bus station during evening rush hour.",
        severity: "Medium",
      },
      {
        date: "2022-11-21",
        city: "Kunduz",
        country: "Afghanistan",
        region: "South Asia",
        latitude: 36.7286,
        longitude: 68.8683,
        attackType: "Suicide Bombing",
        killed: 38,
        wounded: 67,
        description: "Suicide attack at a Shiite mosque during Friday prayers.",
        severity: "Critical",
      },
      {
        date: "2021-04-16",
        city: "Kandahar",
        country: "Afghanistan",
        region: "South Asia",
        latitude: 31.6289,
        longitude: 65.7372,
        attackType: "Car Bomb",
        killed: 22,
        wounded: 45,
        description: "Vehicle-borne improvised explosive device targeted a government convoy.",
        severity: "High",
      },
      {
        date: "2023-07-08",
        city: "Karachi",
        country: "Pakistan",
        region: "South Asia",
        latitude: 24.8607,
        longitude: 67.0011,
        attackType: "Armed Assault",
        killed: 7,
        wounded: 16,
        description: "Armed attackers targeted a religious procession.",
        severity: "Medium",
      },
      {
        date: "2022-01-30",
        city: "Tripoli",
        country: "Libya",
        region: "North Africa",
        latitude: 32.8872,
        longitude: 13.1913,
        attackType: "Car Bomb",
        killed: 14,
        wounded: 29,
        description: "Car bomb explosion near a police academy.",
        severity: "High",
      },
      {
        date: "2021-08-26",
        city: "Herat",
        country: "Afghanistan",
        region: "South Asia",
        latitude: 34.3493,
        longitude: 62.1990,
        attackType: "Armed Assault",
        killed: 11,
        wounded: 24,
        description: "Coordinated attack on multiple security checkpoints.",
        severity: "Medium",
      },
      {
        date: "2023-03-19",
        city: "N'Djamena",
        country: "Chad",
        region: "Central Africa",
        latitude: 12.1348,
        longitude: 15.0557,
        attackType: "Suicide Bombing",
        killed: 19,
        wounded: 38,
        description: "Suicide bomber targeted a military barracks.",
        severity: "High",
      },
      {
        date: "2022-08-07",
        city: "Quetta",
        country: "Pakistan",
        region: "South Asia",
        latitude: 30.1798,
        longitude: 66.9750,
        attackType: "IED",
        killed: 6,
        wounded: 14,
        description: "Roadside bomb targeted a security patrol.",
        severity: "Low",
      },
      {
        date: "2021-10-15",
        city: "Benghazi",
        country: "Libya",
        region: "North Africa",
        latitude: 32.1195,
        longitude: 20.0864,
        attackType: "Armed Assault",
        killed: 13,
        wounded: 27,
        description: "Militants attacked a government facility.",
        severity: "Medium",
      },
      {
        date: "2023-06-25",
        city: "Ouagadougou",
        country: "Burkina Faso",
        region: "West Africa",
        latitude: 12.3714,
        longitude: -1.5197,
        attackType: "Armed Assault",
        killed: 16,
        wounded: 32,
        description: "Armed group attacked a village in rural area.",
        severity: "High",
      },
      {
        date: "2022-04-11",
        city: "Garowe",
        country: "Somalia",
        region: "East Africa",
        latitude: 8.4020,
        longitude: 48.4845,
        attackType: "Car Bomb",
        killed: 21,
        wounded: 43,
        description: "Suicide car bomb near a government compound.",
        severity: "High",
      },
      {
        date: "2020-09-14",
        city: "Kabul",
        country: "Afghanistan",
        region: "South Asia",
        latitude: 34.5553,
        longitude: 69.2075,
        attackType: "Suicide Bombing",
        killed: 48,
        wounded: 89,
        description: "Twin suicide bombings at an education center.",
        severity: "Critical",
      },
      {
        date: "2019-05-08",
        city: "Baghdad",
        country: "Iraq",
        region: "Middle East",
        latitude: 33.3152,
        longitude: 44.3661,
        attackType: "Car Bomb",
        killed: 29,
        wounded: 54,
        description: "Car bomb in a marketplace during busy shopping hours.",
        severity: "High",
      },
      {
        date: "2018-11-21",
        city: "Mogadishu",
        country: "Somalia",
        region: "East Africa",
        latitude: 2.0469,
        longitude: 45.3182,
        attackType: "Suicide Bombing",
        killed: 53,
        wounded: 102,
        description: "Massive truck bomb explosion in downtown area.",
        severity: "Critical",
      },
      {
        date: "2017-03-15",
        city: "Damascus",
        country: "Syria",
        region: "Middle East",
        latitude: 33.5138,
        longitude: 36.2765,
        attackType: "Suicide Bombing",
        killed: 42,
        wounded: 76,
        description: "Suicide attack at a courthouse and restaurant.",
        severity: "Critical",
      },
      {
        date: "2016-07-23",
        city: "Kabul",
        country: "Afghanistan",
        region: "South Asia",
        latitude: 34.5553,
        longitude: 69.2075,
        attackType: "Suicide Bombing",
        killed: 80,
        wounded: 231,
        description: "Suicide bombing targeting a peaceful protest.",
        severity: "Critical",
      },
      {
        date: "2015-10-10",
        city: "Ankara",
        country: "Turkey",
        region: "Middle East",
        latitude: 39.9334,
        longitude: 32.8597,
        attackType: "Suicide Bombing",
        killed: 102,
        wounded: 400,
        description: "Twin suicide bombings at a peace rally.",
        severity: "Critical",
      },
      {
        date: "2014-04-14",
        city: "Chibok",
        country: "Nigeria",
        region: "West Africa",
        latitude: 10.8665,
        longitude: 12.8519,
        attackType: "Armed Assault",
        killed: 3,
        wounded: 8,
        description: "Armed group kidnapped students from a school.",
        severity: "High",
      },
      {
        date: "2013-09-21",
        city: "Nairobi",
        country: "Kenya",
        region: "East Africa",
        latitude: -1.2864,
        longitude: 36.8172,
        attackType: "Armed Assault",
        killed: 67,
        wounded: 175,
        description: "Militants attacked a shopping mall, holding hostages for days.",
        severity: "Critical",
      },
      {
        date: "2012-01-20",
        city: "Kano",
        country: "Nigeria",
        region: "West Africa",
        latitude: 12.0022,
        longitude: 8.5919,
        attackType: "Suicide Bombing",
        killed: 185,
        wounded: 298,
        description: "Coordinated attacks on police stations and government buildings.",
        severity: "Critical",
      },
      {
        date: "2011-12-25",
        city: "Abuja",
        country: "Nigeria",
        region: "West Africa",
        latitude: 9.0765,
        longitude: 7.3986,
        attackType: "Suicide Bombing",
        killed: 44,
        wounded: 73,
        description: "Church bombing on Christmas Day.",
        severity: "Critical",
      },
      {
        date: "2010-07-11",
        city: "Kampala",
        country: "Uganda",
        region: "East Africa",
        latitude: 0.3476,
        longitude: 32.5825,
        attackType: "Suicide Bombing",
        killed: 74,
        wounded: 85,
        description: "Coordinated suicide bombings at venues showing World Cup final.",
        severity: "Critical",
      },
      {
        date: "2009-10-28",
        city: "Peshawar",
        country: "Pakistan",
        region: "South Asia",
        latitude: 34.0151,
        longitude: 71.5249,
        attackType: "Car Bomb",
        killed: 117,
        wounded: 200,
        description: "Car bomb at a crowded market.",
        severity: "Critical",
      },
      {
        date: "2008-11-26",
        city: "Mumbai",
        country: "India",
        region: "South Asia",
        latitude: 19.0760,
        longitude: 72.8777,
        attackType: "Armed Assault",
        killed: 164,
        wounded: 308,
        description: "Coordinated shooting and bombing attacks across the city.",
        severity: "Critical",
      },
      {
        date: "2007-04-18",
        city: "Baghdad",
        country: "Iraq",
        region: "Middle East",
        latitude: 33.3152,
        longitude: 44.3661,
        attackType: "Car Bomb",
        killed: 140,
        wounded: 244,
        description: "Series of car bombs in predominantly Shia neighborhoods.",
        severity: "Critical",
      },
      {
        date: "2006-07-11",
        city: "Mumbai",
        country: "India",
        region: "South Asia",
        latitude: 19.0760,
        longitude: 72.8777,
        attackType: "Bombing",
        killed: 209,
        wounded: 714,
        description: "Series of bomb blasts on commuter trains.",
        severity: "Critical",
      },
      {
        date: "2005-07-07",
        city: "London",
        country: "United Kingdom",
        region: "Europe",
        latitude: 51.5074,
        longitude: -0.1278,
        attackType: "Suicide Bombing",
        killed: 52,
        wounded: 784,
        description: "Coordinated suicide bombings on public transport.",
        severity: "Critical",
      },
      {
        date: "2004-09-01",
        city: "Beslan",
        country: "Russia",
        region: "Europe",
        latitude: 43.1889,
        longitude: 44.5481,
        attackType: "Armed Assault",
        killed: 334,
        wounded: 783,
        description: "School siege that lasted three days.",
        severity: "Critical",
      },
      {
        date: "2003-08-19",
        city: "Baghdad",
        country: "Iraq",
        region: "Middle East",
        latitude: 33.3152,
        longitude: 44.3661,
        attackType: "Truck Bomb",
        killed: 22,
        wounded: 100,
        description: "Truck bomb at UN headquarters.",
        severity: "High",
      },
      {
        date: "2002-10-12",
        city: "Bali",
        country: "Indonesia",
        region: "Southeast Asia",
        latitude: -8.4095,
        longitude: 115.1889,
        attackType: "Suicide Bombing",
        killed: 202,
        wounded: 209,
        description: "Coordinated bombings at tourist locations.",
        severity: "Critical",
      },
      {
        date: "2001-09-11",
        city: "New York",
        country: "United States",
        region: "North America",
        latitude: 40.7128,
        longitude: -74.0060,
        attackType: "Hijacking",
        killed: 2977,
        wounded: 6000,
        description: "Coordinated hijacking of commercial aircraft used as weapons.",
        severity: "Critical",
      },
      {
        date: "2024-09-01",
        city: "Mafa",
        country: "Nigeria",
        region: "West Africa",
        latitude: 11.9234,
        longitude: 13.6001,
        attackType: "Armed Assault",
        killed: 81,
        wounded: 45,
        description: "Boko Haram militants attacked Mafa village, shooting residents and burning buildings.",
        severity: "Critical",
      },
      {
        date: "2024-09-05",
        city: "Tarmuwa",
        country: "Nigeria",
        region: "West Africa",
        latitude: 12.1000,
        longitude: 11.7500,
        attackType: "Armed Assault",
        killed: 100,
        wounded: 50,
        description: "Suspected Boko Haram extremists attacked the Tarmuwa council area, causing mass casualties.",
        severity: "Critical",
      },
      {
        date: "2025-01-15",
        city: "Mallam Fatori",
        country: "Nigeria",
        region: "West Africa",
        latitude: 13.6766,
        longitude: 13.3378,
        attackType: "Armed Assault",
        killed: 20,
        wounded: 35,
        description: "ISWAP fighters overran an army base near the Niger border.",
        severity: "High",
      },
      {
        date: "2025-03-25",
        city: "Wulgo",
        country: "Nigeria",
        region: "West Africa",
        latitude: 12.4667,
        longitude: 14.2000,
        attackType: "Armed Assault",
        killed: 12,
        wounded: 10,
        description: "Joint Boko Haram and ISWAP attack on a military base.",
        severity: "High",
      },
      {
        date: "2025-05-10",
        city: "Marte",
        country: "Nigeria",
        region: "West Africa",
        latitude: 12.3667,
        longitude: 13.8333,
        attackType: "Armed Assault",
        killed: 5,
        wounded: 0,
        description: "Boko Haram attack forced 20,000 residents to flee.",
        severity: "Medium",
      },
      {
        date: "2025-06-21",
        city: "Konduga",
        country: "Nigeria",
        region: "West Africa",
        latitude: 11.6533,
        longitude: 13.4181,
        attackType: "Suicide Bombing",
        killed: 12,
        wounded: 25,
        description: "Suicide bombing in Konduga town.",
        severity: "High",
      },
      {
        date: "2025-10-15",
        city: "Maiduguri",
        country: "Nigeria",
        region: "West Africa",
        latitude: 11.8333,
        longitude: 13.1500,
        attackType: "Drone Attack",
        killed: 4,
        wounded: 5,
        description: "Drone-backed attacks by insurgents in Borno state.",
        severity: "Medium",
      },
    ];

    sampleAttacks.forEach((attack) => {
      const id = randomUUID();
      this.attacks.set(id, { id, ...attack });
    });
  }

  async getAllAttacks(filters?: AttackFilters): Promise<Attack[]> {
    let attacks = Array.from(this.attacks.values());

    if (filters) {
      if (filters.dateFrom) {
        attacks = attacks.filter(a => a.date >= filters.dateFrom!);
      }
      if (filters.dateTo) {
        attacks = attacks.filter(a => a.date <= filters.dateTo!);
      }
      if (filters.countries && filters.countries.length > 0) {
        attacks = attacks.filter(a => filters.countries!.includes(a.country));
      }
      if (filters.regions && filters.regions.length > 0) {
        attacks = attacks.filter(a => filters.regions!.includes(a.region));
      }
      if (filters.attackTypes && filters.attackTypes.length > 0) {
        attacks = attacks.filter(a => filters.attackTypes!.includes(a.attackType));
      }
      if (filters.severities && filters.severities.length > 0) {
        attacks = attacks.filter(a => filters.severities!.includes(a.severity));
      }
      if (filters.casualtyMin !== undefined && filters.casualtyMin > 0) {
        attacks = attacks.filter(a => (a.killed + a.wounded) >= filters.casualtyMin!);
      }
      if (filters.casualtyMax !== undefined && filters.casualtyMax < 3000) {
        attacks = attacks.filter(a => (a.killed + a.wounded) <= filters.casualtyMax!);
      }
      if (filters.searchQuery) {
        const query = filters.searchQuery.toLowerCase();
        attacks = attacks.filter(a =>
          a.city.toLowerCase().includes(query) ||
          a.country.toLowerCase().includes(query) ||
          a.region.toLowerCase().includes(query) ||
          a.attackType.toLowerCase().includes(query) ||
          a.description.toLowerCase().includes(query)
        );
      }
    }

    return attacks.sort((a, b) => b.date.localeCompare(a.date));
  }

  async getAttackById(id: string): Promise<Attack | undefined> {
    return this.attacks.get(id);
  }

  async getStats(): Promise<Stats> {
    const attacks = Array.from(this.attacks.values());

    const totalKilled = attacks.reduce((sum, a) => sum + a.killed, 0);
    const totalWounded = attacks.reduce((sum, a) => sum + a.wounded, 0);

    const regionCounts = new Map<string, number>();
    const countryCounts = new Map<string, number>();
    const typeCounts = new Map<string, number>();

    attacks.forEach(attack => {
      regionCounts.set(attack.region, (regionCounts.get(attack.region) || 0) + 1);
      countryCounts.set(attack.country, (countryCounts.get(attack.country) || 0) + 1);
      typeCounts.set(attack.attackType, (typeCounts.get(attack.attackType) || 0) + 1);
    });

    const topRegion = Array.from(regionCounts.entries())
      .sort(([, a], [, b]) => b - a)[0]?.[0] || "N/A";

    const topCountry = Array.from(countryCounts.entries())
      .sort(([, a], [, b]) => b - a)[0]?.[0] || "N/A";

    const topAttackType = Array.from(typeCounts.entries())
      .sort(([, a], [, b]) => b - a)[0]?.[0] || "N/A";

    return {
      totalAttacks: attacks.length,
      totalKilled,
      totalWounded,
      topRegion,
      topCountry,
      topAttackType,
    };
  }
}

export const storage = new MemStorage();
