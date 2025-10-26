export enum Role {
    ADMIN = 'Admin',
    RESIDENT = 'Resident',
    DISPATCH_RIDER = 'Dispatch Rider',
    STORE = 'Store',
    SERVICE_PROVIDER = 'Service Provider',
}

export enum ApprovalStatus {
    APPROVED = 'Approved',
    PENDING = 'Pending',
    SUSPENDED = 'Suspended',
}

export enum DeliveryStatus {
    PENDING = 'Pending',
    ACCEPTED = 'Accepted',
    IN_TRANSIT = 'In Transit',
    COMPLETED = 'Completed',
    CANCELLED = 'Cancelled',
    AWAITING_GATE_PASS = 'Awaiting Gate Pass',
}

export enum GatePassStatus {
    PENDING = 'Pending',
    APPROVED = 'Approved',
    DECLINED = 'Declined',
    USED = 'Used',
    EXPIRED = 'Expired',
}

export enum VehicleType {
    MOTORCYCLE = 'Motorcycle',
    TRICYCLE = 'Tricycle',
    BICYCLE = 'Bicycle',
    CAR = 'Car',
    BUS = 'Bus',
}

// Using a discriminated union for User for better type safety
interface BaseUser {
    id: string;
    name: string;
    email: string;
    phone: string;
    address: string;
    role: Role;
    photoUrl?: string;
    approvalStatus: ApprovalStatus;
    operatesOutsideEstate: boolean;
    lat: number;
    lng: number;
}

export interface ResidentUser extends BaseUser {
    role: Role.RESIDENT;
    proofOfAddressUrl?: string;
    meansOfIdUrl?: string;
}

export interface RiderUser extends BaseUser {
    role: Role.DISPATCH_RIDER;
    vehicleOwnershipUrl?: string;
    driverLicenceUrl?: string;
    vehicleLicencePlate?: string;
    vehicleType?: VehicleType;
    isOnline?: boolean;
    rating?: number;
    reviewCount?: number;
}

export interface StoreUser extends BaseUser {
    role: Role.STORE;
    businessName?: string;
    storeOwnershipUrl?: string;
    hoursOfOperation?: string;
    incorporationCertUrl?: string;
    meansOfIdUrl?: string; // Owner's ID
}

export interface ServiceProviderUser extends BaseUser {
    role: Role.SERVICE_PROVIDER;
    tradeLicenceUrl?: string;
    residenceProofUrl?: string;
    meansOfIdUrl?: string;
    hoursOfOperation?: string;
}

export interface AdminUser extends BaseUser {
    role: Role.ADMIN;
}

export type User = ResidentUser | RiderUser | StoreUser | ServiceProviderUser | AdminUser;


export interface DeliveryRequest {
    id: string;
    requesterId: string; // Can be Resident, Store, or Service Provider
    requesterName: string;
    pickupAddress: string;
    dropoffAddress: string;
    description: string;
    estimatedCost?: number;
    status: DeliveryStatus;
    riderId?: string;
    riderName?: string;
    createdAt: string;
    pickupLat: number;
    pickupLng: number;
}

export interface GatePass {
    id: string;
    residentId: string;
    residentName: string;
    visitorName: string;
    visitorType: Role;
    purpose: string;
    visitDateTime: string;
    status: GatePassStatus;
    qrCode: string;
    targetVisitorId?: string;
    linkedDeliveryId?: string;
}

export interface Announcement {
    id: string;
    title: string;
    content: string;
    createdAt: string;
}

export interface Message {
    id: string;
    conversationId: string;
    senderId: string;
    receiverId: string;
    text: string;
    timestamp: string;
    read: boolean;
}

export interface Conversation {
    id: string;
    participantIds: string[];
    lastMessage: {
        text: string;
        timestamp: string;
    };
}