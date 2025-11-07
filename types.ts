import type { Session } from '@supabase/supabase-js';

// Re-exporting Session for convenience
export type { Session };

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

// A single User interface to map to a 'profiles' table in Supabase
export interface User {
    id: string;
    name: string;
    email: string;
    phone: string;
    address: string;
    role: Role;
    photo_url?: string;
    approval_status: ApprovalStatus;
    operates_outside_estate: boolean;
    lat: number;
    lng: number;

    // Role-specific fields
    proof_of_address_url?: string;
    means_of_id_url?: string;
    vehicle_ownership_url?: string;
    driver_licence_url?: string;
    vehicle_licence_plate?: string;
    vehicle_type?: VehicleType;
    is_online?: boolean;
    rating?: number;
    review_count?: number;
    business_name?: string;
    store_ownership_url?: string;
    hours_of_operation?: string;
    incorporation_cert_url?: string;
    trade_licence_url?: string;
    residence_proof_url?: string;
}


export interface DeliveryRequest {
    id: string;
    requester_id: string;
    requester_name: string;
    pickup_address: string;
    dropoff_address: string;
    description: string;
    estimated_cost?: number;
    status: DeliveryStatus;
    rider_id?: string;
    rider_name?: string;
    created_at: string;
    pickup_lat: number;
    pickup_lng: number;
}

export interface GatePass {
    id: string;
    resident_id: string;
    resident_name: string;
    visitor_name: string;
    visitor_type: Role;
    purpose: string;
    visit_date_time: string;
    status: GatePassStatus;
    qr_code: string;
    target_visitor_id?: string;
    linked_delivery_id?: string;
    created_at: string;
}

export interface Announcement {
    id: string;
    title: string;
    content: string;
    created_at: string;
}

export interface Message {
    id: string;
    conversation_id: string;
    sender_id: string;
    receiver_id: string;
    text: string;
    timestamp: string;
    read: boolean;
}

export interface Conversation {
    id: string;
    participant_ids: string[];
    last_message_text: string;
    last_message_timestamp: string;
}