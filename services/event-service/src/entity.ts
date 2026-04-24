export enum EventStatus {
  DRAFT = "DRAFT",
  PUBLISHED = "PUBLISHED",
  CANCELLED = "CANCELLED",
  COMPLETED = "COMPLETED",
}

export enum InscriptionStatus {
  PENDING = "PENDING",
  CONFIRMED = "CONFIRMED",
  CANCELLED = "CANCELLED",
  WAITLISTED = "WAITLISTED",
}

export class Category {
  constructor(
    private id: string,
    private name: string,
    private slug: string,
  ) {}

  public rename(name: string): void {
    this.name = name;
  }
}

export class Event {
  private confirmedRegistrations = 0;

  constructor(
    private id: string,
    private organizerUserId: string,
    private categoryId: string,
    private title: string,
    private description: string,
    private venueOrLink: string,
    private startsAt: Date,
    private endsAt: Date,
    private eventMaxCapacity: number,
    private createdAt: Date,
    private status: EventStatus,
  ) {}

  public publish(): void {
    this.status = EventStatus.PUBLISHED;
  }

  public cancel(): void {
    this.status = EventStatus.CANCELLED;
  }

  public updateSchedule(start: Date, end: Date): void {
    this.startsAt = start;
    this.endsAt = end;
  }

  public getAvailability(): number {
    return Math.max(0, this.eventMaxCapacity - this.confirmedRegistrations);
  }
}

export class Activity {
  private roomOccupancy = 0;

  constructor(
    private id: string,
    private eventId: string,
    private title: string,
    private description: string,
    private startsAt: Date,
    private location: string,
    private duration: number,
    private roomCapacity: number,
  ) {}

  public isFull(): boolean {
    return this.roomOccupancy >= this.roomCapacity;
  }

  public reschedule(at: Date): void {
    this.startsAt = at;
  }

  public isConflict(other: Activity): boolean {
    const thisEnd = new Date(this.startsAt.getTime() + this.duration * 60_000);
    const otherEnd = new Date(other.startsAt.getTime() + other.duration * 60_000);
    return this.startsAt < otherEnd && other.startsAt < thisEnd;
  }
}

export class Speaker {
  constructor(
    private id: string,
    private fullName: string,
    private bio: string,
    private affiliation: string,
  ) {}

  public updateProfile(name: string, bio: string): void {
    this.fullName = name;
    this.bio = bio;
  }
}

export class Inscription {
  constructor(
    private id: string,
    private eventId: string,
    private participantUserId: string,
    private createdAt: Date,
    private status: InscriptionStatus,
  ) {}

  public cancel(): void {
    this.status = InscriptionStatus.CANCELLED;
  }

  public confirm(): void {
    this.status = InscriptionStatus.CONFIRMED;
  }
}

export class CheckIn {
  constructor(
    private id: string,
    private inscriptionId: string,
    private checkedAt: Date,
    private method: string,
    private notes?: string,
  ) {}

  public validateEntry(): void {
    this.checkedAt = new Date();
  }
}

export class Certificate {
  constructor(
    private id: string,
    private inscriptionId: string,
    private issueDate: Date,
    private verificationCode: string,
    private performanceScore?: number,
  ) {}

  public getVerificationCode(): string {
    return this.verificationCode;
  }

  public validate(): boolean {
    return this.verificationCode.length > 0;
  }
}
