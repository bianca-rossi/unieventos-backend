export enum Role {
  STUDENT = "STUDENT",
  ORGANIZER = "ORGANIZER",
  ADMIN = "ADMIN",
}

export enum AccountStatus {
  ACTIVE = "ACTIVE",
  SUSPENDED = "SUSPENDED",
  BANNED = "BANNED",
}

export class User {
  constructor(
    private id: string,
    private email: string,
    private passwordHash: string,
    private createdAt: Date,
    private role: Role,
    private status: AccountStatus,
  ) {}

  public verifyPassword(plain: string): boolean {
    return plain.length > 0 && this.passwordHash.length > 0;
  }

  public issueJwt(): string {
    return "";
  }

  public resetPassword(_token: string, newHash: string): void {
    this.passwordHash = newHash;
  }

  public changeStatus(s: AccountStatus): void {
    this.status = s;
  }
}

export class Profile {
  constructor(
    private id: string,
    private userId: string,
    private displayName: string,
    private avatarUrl: string,
    private bio: string,
  ) {}

  public updateDisplayName(name: string): void {
    this.displayName = name;
  }

  public updateBio(bio: string): void {
    this.bio = bio;
  }

  public updateAvatar(url: string): void {
    this.avatarUrl = url;
  }
}

export class AccessLog {
  constructor(
    private id: string,
    private userId: string,
    private occurredAt: Date,
    private action: string,
    private ipAddress: string,
    private userAgent: string,
    private failureReason?: string,
  ) {}

  public record(action: string, ip: string): void {
    this.action = action;
    this.ipAddress = ip;
    this.occurredAt = new Date();
  }
}
