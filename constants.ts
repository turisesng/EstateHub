import { User, Role, ApprovalStatus, DeliveryRequest, DeliveryStatus, GatePass, GatePassStatus, Announcement, Conversation, Message, VehicleType } from './types';

// Mock coordinates centered around a fictional estate in Lagos, Nigeria (approx 6.52 N, 3.37 E)
export const USERS: User[] = [
  // FIX: Renamed photoUrl to photo_url, approvalStatus to approval_status, operatesOutsideEstate to operates_outside_estate
  { id: 'admin1', name: 'Dr. Amina Yusuf', email: 'admin@estate.com', phone: '08012345678', address: 'Estate Management Office', role: Role.ADMIN, photo_url: 'https://i.pravatar.cc/150?u=admin1', approval_status: ApprovalStatus.APPROVED, operates_outside_estate: false, lat: 6.5244, lng: 3.3792 },
  
  // Residents
  // FIX: Renamed photoUrl to photo_url, approvalStatus to approval_status, operatesOutsideEstate to operates_outside_estate, proofOfAddressUrl to proof_of_address_url, meansOfIdUrl to means_of_id_url
  { id: 'res1', name: 'Chinedu Okoro', email: 'chinedu@email.com', phone: '08023456789', address: 'Block 1, Apt 2A', role: Role.RESIDENT, photo_url: 'https://i.pravatar.cc/150?u=res1', approval_status: ApprovalStatus.APPROVED, operates_outside_estate: false, proof_of_address_url: '/path/to/rent.pdf', means_of_id_url: '/path/to/id.pdf', lat: 6.5250, lng: 3.3790 },
  // FIX: Renamed photoUrl to photo_url, approvalStatus to approval_status, operatesOutsideEstate to operates_outside_estate, proofOfAddressUrl to proof_of_address_url, meansOfIdUrl to means_of_id_url
  { id: 'res2', name: 'Funke Adebayo', email: 'funke@email.com', phone: '08034567890', address: 'Block 5, Apt 4B', role: Role.RESIDENT, photo_url: 'https://i.pravatar.cc/150?u=res2', approval_status: ApprovalStatus.APPROVED, operates_outside_estate: false, proof_of_address_url: '/path/to/sales.pdf', means_of_id_url: '/path/to/id2.pdf', lat: 6.5235, lng: 3.3805 },
  // FIX: Renamed photoUrl to photo_url, approvalStatus to approval_status, operatesOutsideEstate to operates_outside_estate, proofOfAddressUrl to proof_of_address_url, meansOfIdUrl to means_of_id_url
  { id: 'res3', name: 'Ngozi Eze', email: 'ngozi@email.com', phone: '08045678901', address: 'Block 2, Apt 1C', role: Role.RESIDENT, photo_url: 'https://i.pravatar.cc/150?u=res3', approval_status: ApprovalStatus.APPROVED, operates_outside_estate: false, proof_of_address_url: '/path/to/rent3.pdf', means_of_id_url: '/path/to/id3.pdf', lat: 6.5255, lng: 3.3795 },
  // FIX: Renamed photoUrl to photo_url, approvalStatus to approval_status, operatesOutsideEstate to operates_outside_estate, proofOfAddressUrl to proof_of_address_url, meansOfIdUrl to means_of_id_url
  { id: 'res4', name: 'Tayo Johnson', email: 'tayo@email.com', phone: '08056789012', address: 'Block 8, Penthouse', role: Role.RESIDENT, photo_url: 'https://i.pravatar.cc/150?u=res4', approval_status: ApprovalStatus.APPROVED, operates_outside_estate: false, proof_of_address_url: '/path/to/rent4.pdf', means_of_id_url: '/path/to/id4.pdf', lat: 6.5228, lng: 3.3810 },
  // FIX: Renamed photoUrl to photo_url, approvalStatus to approval_status, operatesOutsideEstate to operates_outside_estate, proofOfAddressUrl to proof_of_address_url, meansOfIdUrl to means_of_id_url
  { id: 'res5', name: 'Fatima Abubakar', email: 'fatima@email.com', phone: '08067890123', address: 'Block 3, Apt 3A', role: Role.RESIDENT, photo_url: 'https://i.pravatar.cc/150?u=res5', approval_status: ApprovalStatus.APPROVED, operates_outside_estate: false, proof_of_address_url: '/path/to/rent5.pdf', means_of_id_url: '/path/to/id5.pdf', lat: 6.5260, lng: 3.3788 },
  // FIX: Renamed photoUrl to photo_url, approvalStatus to approval_status, operatesOutsideEstate to operates_outside_estate, proofOfAddressUrl to proof_of_address_url, meansOfIdUrl to means_of_id_url
  { id: 'res6', name: 'Dele Ojo', email: 'dele@email.com', phone: '08078901234', address: 'Block 10, Apt 5D', role: Role.RESIDENT, photo_url: 'https://i.pravatar.cc/150?u=res6', approval_status: ApprovalStatus.PENDING, operates_outside_estate: false, proof_of_address_url: '/path/to/rent6.pdf', means_of_id_url: '/path/to/id6.pdf', lat: 6.5233, lng: 3.3799 },
  // FIX: Renamed photoUrl to photo_url, approvalStatus to approval_status, operatesOutsideEstate to operates_outside_estate, proofOfAddressUrl to proof_of_address_url, meansOfIdUrl to means_of_id_url
  { id: 'res7', name: 'Bisi Williams', email: 'bisi@email.com', phone: '08089012345', address: 'Block 4, Apt 2B', role: Role.RESIDENT, photo_url: 'https://i.pravatar.cc/150?u=res7', approval_status: ApprovalStatus.APPROVED, operates_outside_estate: false, proof_of_address_url: '/path/to/rent7.pdf', means_of_id_url: '/path/to/id7.pdf', lat: 6.5245, lng: 3.3812 },

  // Riders
  // FIX: Renamed properties to snake_case
  { id: 'rider1', name: 'Musa Aliyu', email: 'musa@rider.com', phone: '08045678901', address: 'Rider Stand, Gate 1', role: Role.DISPATCH_RIDER, photo_url: 'https://i.pravatar.cc/150?u=rider1', approval_status: ApprovalStatus.APPROVED, operates_outside_estate: false, vehicle_ownership_url: '/path/to/vehicle.pdf', driver_licence_url: '/path/to/driver-licence.pdf', vehicle_licence_plate: 'ABC-123DE', vehicle_type: VehicleType.MOTORCYCLE, lat: 6.5240, lng: 3.3785, is_online: true, rating: 4.8, review_count: 125 },
  // FIX: Renamed properties to snake_case
  { id: 'rider2', name: 'David Jones', email: 'david@rider.com', phone: '08056789012', address: '123, Main Street', role: Role.DISPATCH_RIDER, photo_url: 'https://i.pravatar.cc/150?u=rider2', approval_status: ApprovalStatus.APPROVED, operates_outside_estate: true, vehicle_ownership_url: '/path/to/vehicle2.pdf', driver_licence_url: '/path/to/driver-licence2.pdf', vehicle_licence_plate: 'XYZ-789FG', vehicle_type: VehicleType.TRICYCLE, lat: 6.5280, lng: 3.3850, is_online: false, rating: 4.5, review_count: 88 },
  // FIX: Renamed properties to snake_case
  { id: 'rider3', name: 'Aisha Bello', email: 'aisha@rider.com', phone: '08089012345', address: 'Rider Stand, Gate 2', role: Role.DISPATCH_RIDER, photo_url: 'https://i.pravatar.cc/150?u=rider3', approval_status: ApprovalStatus.SUSPENDED, operates_outside_estate: false, vehicle_type: VehicleType.BICYCLE, vehicle_licence_plate: 'B-001', lat: 6.5275, lng: 3.3815, is_online: true, rating: 4.2, review_count: 45 },
  // FIX: Renamed properties to snake_case
  { id: 'rider4', name: 'Tunde Bakare', email: 'tunde@rider.com', phone: '08090123456', address: 'Rider Stand, Gate 1', role: Role.DISPATCH_RIDER, photo_url: 'https://i.pravatar.cc/150?u=rider4', approval_status: ApprovalStatus.APPROVED, operates_outside_estate: false, vehicle_ownership_url: '/path/to/vehicle4.pdf', driver_licence_url: '/path/to/driver-licence4.pdf', vehicle_licence_plate: 'LAG-456JK', vehicle_type: VehicleType.MOTORCYCLE, lat: 6.5242, lng: 3.3787, is_online: true, rating: 4.9, review_count: 210 },
  // FIX: Renamed properties to snake_case
  { id: 'rider5', name: 'Sade Williams', email: 'sade@rider.com', phone: '08101234567', address: '25, External Road', role: Role.DISPATCH_RIDER, photo_url: 'https://i.pravatar.cc/150?u=rider5', approval_status: ApprovalStatus.APPROVED, operates_outside_estate: true, vehicle_ownership_url: '/path/to/vehicle5.pdf', driver_licence_url: '/path/to/driver-licence5.pdf', vehicle_licence_plate: 'OGN-789LM', vehicle_type: VehicleType.CAR, lat: 6.5295, lng: 3.3860, is_online: false, rating: 4.7, review_count: 95 },
  // FIX: Renamed properties to snake_case
  { id: 'rider6', name: 'Usman Danjuma', email: 'usman@rider.com', phone: '08112345678', address: 'Rider Stand, Gate 1', role: Role.DISPATCH_RIDER, photo_url: 'https://i.pravatar.cc/150?u=rider6', approval_status: ApprovalStatus.APPROVED, operates_outside_estate: false, vehicle_type: VehicleType.MOTORCYCLE, vehicle_licence_plate: 'FST-111AB', lat: 6.5241, lng: 3.3786, is_online: true, rating: 4.6, review_count: 78 },
  // FIX: Renamed properties to snake_case
  { id: 'rider7', name: 'Paul Ibe', email: 'paul@rider.com', phone: '08123456789', address: '50, Outer Ring Rd', role: Role.DISPATCH_RIDER, photo_url: 'https://i.pravatar.cc/150?u=rider7', approval_status: ApprovalStatus.PENDING, operates_outside_estate: true, vehicle_type: VehicleType.TRICYCLE, vehicle_licence_plate: 'APP-222BC', lat: 6.5310, lng: 3.3890, is_online: false, rating: 5.0, review_count: 12 },
  // FIX: Renamed properties to snake_case
  { id: 'rider8', name: 'Kingsley Ugwu', email: 'kingsley@rider.com', phone: '08134567890', address: 'Rider Stand, Gate 2', role: Role.DISPATCH_RIDER, photo_url: 'https://i.pravatar.cc/150?u=rider8', approval_status: ApprovalStatus.APPROVED, operates_outside_estate: false, vehicle_type: VehicleType.BICYCLE, vehicle_licence_plate: 'B-002', lat: 6.5276, lng: 3.3816, is_online: true, rating: 4.3, review_count: 30 },
  // FIX: Renamed properties to snake_case
  { id: 'rider9', name: 'Samson Ade', email: 'samson@rider.com', phone: '08145678901', address: 'Rider Stand, Gate 1', role: Role.DISPATCH_RIDER, photo_url: 'https://i.pravatar.cc/150?u=rider9', approval_status: ApprovalStatus.APPROVED, operates_outside_estate: false, vehicle_type: VehicleType.MOTORCYCLE, vehicle_licence_plate: 'KJA-333CD', lat: 6.5243, lng: 3.3788, is_online: false, rating: 4.8, review_count: 150 },
  // FIX: Renamed properties to snake_case
  { id: 'rider10', name: 'Victor Eze', email: 'victor@rider.com', phone: '08156789012', address: '88, Expressway', role: Role.DISPATCH_RIDER, photo_url: 'https://i.pravatar.cc/150?u=rider10', approval_status: ApprovalStatus.APPROVED, operates_outside_estate: true, vehicle_type: VehicleType.BUS, vehicle_licence_plate: 'GGE-444DE', lat: 6.5325, lng: 3.3910, is_online: true, rating: 4.9, review_count: 180 },

  // Stores
  // FIX: Renamed properties to snake_case
  { id: 'store1', name: 'Chioma Nwosu', business_name: 'Mama Chi\'s Groceries', email: 'mama.chi@store.com', phone: '08067890123', address: 'Shop 3, Estate Plaza', role: Role.STORE, photo_url: 'https://i.pravatar.cc/150?u=store1', approval_status: ApprovalStatus.APPROVED, operates_outside_estate: false, store_ownership_url: '/path/to/store-bill.pdf', hours_of_operation: 'Mon - Sat: 8 AM - 9 PM', incorporation_cert_url: '/path/to/cac.pdf', means_of_id_url: '/path/to/chioma-id.pdf', lat: 6.5260, lng: 3.3800 },
  // FIX: Renamed properties to snake_case
  { id: 'store2', name: 'Bola Ahmed', business_name: 'Bola\'s Pharmacy', email: 'bola.pharma@store.com', phone: '08112345678', address: 'Shop 5, Estate Plaza', role: Role.STORE, photo_url: 'https://i.pravatar.cc/150?u=store2', approval_status: ApprovalStatus.APPROVED, operates_outside_estate: false, store_ownership_url: '/path/to/store-bill2.pdf', hours_of_operation: 'Mon - Sun: 9 AM - 10 PM', incorporation_cert_url: '/path/to/cac2.pdf', means_of_id_url: '/path/to/bola-id.pdf', lat: 6.5262, lng: 3.3803 },
  // FIX: Renamed properties to snake_case
  { id: 'store3', name: 'Emeka Oji', business_name: 'Emeka\'s Electronics', email: 'emeka.electro@store.com', phone: '08123456789', address: '10, Commercial Avenue', role: Role.STORE, photo_url: 'https://i.pravatar.cc/150?u=store3', approval_status: ApprovalStatus.PENDING, operates_outside_estate: true, store_ownership_url: '/path/to/store-bill3.pdf', hours_of_operation: 'Mon - Fri: 9 AM - 6 PM', incorporation_cert_url: '/path/to/cac3.pdf', means_of_id_url: '/path/to/emeka-id.pdf', lat: 6.5300, lng: 3.3880 },
  // FIX: Renamed properties to snake_case
  { id: 'store4', name: 'Hassan Bello', business_name: 'Daily Needs Supermart', email: 'daily.needs@store.com', phone: '08167890123', address: 'Shop 1, Estate Plaza', role: Role.STORE, photo_url: 'https://i.pravatar.cc/150?u=store4', approval_status: ApprovalStatus.APPROVED, operates_outside_estate: false, hours_of_operation: 'Mon - Sun: 7 AM - 10 PM', lat: 6.5258, lng: 3.3798 },
  // FIX: Renamed properties to snake_case
  { id: 'store5', name: 'Amina Salisu', business_name: 'Fresh Bakes Bakery', email: 'fresh.bakes@store.com', phone: '08178901234', address: 'Shop 8, Estate Plaza', role: Role.STORE, photo_url: 'https://i.pravatar.cc/150?u=store5', approval_status: ApprovalStatus.APPROVED, operates_outside_estate: false, hours_of_operation: 'Tue - Sun: 6 AM - 7 PM', lat: 6.5265, lng: 3.3808 },
  // FIX: Renamed properties to snake_case
  { id: 'store6', name: 'Tope Alabi', business_name: 'The Tech Hub', email: 'tech.hub@store.com', phone: '08189012345', address: '22, Innovation Drive', role: Role.STORE, photo_url: 'https://i.pravatar.cc/150?u=store6', approval_status: ApprovalStatus.PENDING, operates_outside_estate: true, hours_of_operation: 'Mon - Sat: 10 AM - 8 PM', lat: 6.5330, lng: 3.3920 },
  // FIX: Renamed properties to snake_case
  { id: 'store7', name: 'Ify Okeke', business_name: 'Luxe Fashion Boutique', email: 'luxe.fashion@store.com', phone: '09012345678', address: 'Shop 12, Estate Plaza', role: Role.STORE, photo_url: 'https://i.pravatar.cc/150?u=store7', approval_status: ApprovalStatus.APPROVED, operates_outside_estate: false, hours_of_operation: 'Mon - Sat: 10 AM - 9 PM', lat: 6.5268, lng: 3.3811 },
  // FIX: Renamed properties to snake_case
  { id: 'store8', name: 'Gbenga Peters', business_name: 'QuickFix Hardware', email: 'quick.fix@store.com', phone: '09023456789', address: '45, Industrial Layout', role: Role.STORE, photo_url: 'https://i.pravatar.cc/150?u=store8', approval_status: ApprovalStatus.APPROVED, operates_outside_estate: true, hours_of_operation: 'Mon - Sat: 8 AM - 6 PM', lat: 6.5340, lng: 3.3940 },

  // Service Providers
  // FIX: Renamed properties to snake_case
  { id: 'sp1', name: 'Femi Adekunle (Plumber)', email: 'fixit@services.com', phone: '08078901234', address: '456, Market Road', role: Role.SERVICE_PROVIDER, photo_url: 'https://i.pravatar.cc/150?u=sp1', approval_status: ApprovalStatus.APPROVED, operates_outside_estate: true, hours_of_operation: '24/7 Emergency Service', trade_licence_url: '/path/to/trade-licence.pdf', means_of_id_url: '/path/to/femi-id.pdf', residence_proof_url: '/path/to/femi-residence.pdf', lat: 6.5220, lng: 3.3770 },
  // FIX: Renamed properties to snake_case
  { id: 'sp2', name: 'Grace Eze (Cleaner)', email: 'grace.cleaners@services.com', phone: '08134567890', address: 'Suite 10, Service Complex', role: Role.SERVICE_PROVIDER, photo_url: 'https://i.pravatar.cc/150?u=sp2', approval_status: ApprovalStatus.APPROVED, operates_outside_estate: false, hours_of_operation: 'By appointment', trade_licence_url: '/path/to/trade-licence2.pdf', means_of_id_url: '/path/to/grace-id.pdf', residence_proof_url: '/path/to/grace-residence.pdf', lat: 6.5255, lng: 3.3798 },
  // FIX: Renamed properties to snake_case
  { id: 'sp3', name: 'John Doe (Gardener)', email: 'johndoe.gardens@services.com', phone: '08145678901', address: 'Green Valley Estate', role: Role.SERVICE_PROVIDER, photo_url: 'https://i.pravatar.cc/150?u=sp3', approval_status: ApprovalStatus.APPROVED, operates_outside_estate: true, hours_of_operation: 'Mon - Sat: 8 AM - 5 PM', trade_licence_url: '/path/to/trade-licence3.pdf', means_of_id_url: '/path/to/john-id.pdf', residence_proof_url: '/path/to/john-residence.pdf', lat: 6.5210, lng: 3.3760 },
  // FIX: Renamed properties to snake_case
  { id: 'sp4', name: 'Titi Coker (Tailor)', email: 'titi.stitches@services.com', phone: '09034567890', address: 'Shop 15, Fashion Wing', role: Role.SERVICE_PROVIDER, photo_url: 'https://i.pravatar.cc/150?u=sp4', approval_status: ApprovalStatus.APPROVED, operates_outside_estate: false, hours_of_operation: 'Mon - Sat: 9 AM - 7 PM', lat: 6.5270, lng: 3.3814 },
  // FIX: Renamed properties to snake_case
  { id: 'sp5', name: 'Ahmed Bello (Electrician)', email: 'ahmed.sparks@services.com', phone: '09045678901', address: '77, Powerline Avenue', role: Role.SERVICE_PROVIDER, photo_url: 'https://i.pravatar.cc/150?u=sp5', approval_status: ApprovalStatus.APPROVED, operates_outside_estate: true, hours_of_operation: '24/7 Emergency Service', lat: 6.5200, lng: 3.3750 },
  // FIX: Renamed properties to snake_case
  { id: 'sp6', name: 'Rose Okeke (Nanny)', email: 'rose.cares@services.com', phone: '09056789012', address: 'Block 7, Apt 1A', role: Role.SERVICE_PROVIDER, photo_url: 'https://i.pravatar.cc/150?u=sp6', approval_status: ApprovalStatus.SUSPENDED, operates_outside_estate: false, hours_of_operation: 'Live-in / By schedule', lat: 6.5238, lng: 3.3802 },
  // FIX: Renamed properties to snake_case
  { id: 'sp7', name: 'Mike Adenuga (Car Wash)', email: 'mike.wash@services.com', phone: '09067890123', address: 'Estate Car Wash Bay', role: Role.SERVICE_PROVIDER, photo_url: 'https://i.pravatar.cc/150?u=sp7', approval_status: ApprovalStatus.APPROVED, operates_outside_estate: false, hours_of_operation: 'Mon - Sun: 8 AM - 6 PM', lat: 6.5248, lng: 3.3792 },
  // FIX: Renamed properties to snake_case
  { id: 'sp8', name: 'Daniel Olu (Tutor)', email: 'daniel.tutor@services.com', phone: '09078901234', address: '15, Knowledge Crescent', role: Role.SERVICE_PROVIDER, photo_url: 'https://i.pravatar.cc/150?u=sp8', approval_status: ApprovalStatus.APPROVED, operates_outside_estate: true, hours_of_operation: 'By appointment', lat: 6.5215, lng: 3.3765 },
];

export const DELIVERY_REQUESTS: DeliveryRequest[] = [
  // FIX: Renamed properties to snake_case
  { id: 'del1', requester_id: 'res1', requester_name: 'Chinedu Okoro', pickup_address: 'Mama Chi\'s Groceries', dropoff_address: 'Block 1, Apt 2A', description: 'Weekly grocery shopping', estimated_cost: 500, status: DeliveryStatus.COMPLETED, rider_id: 'rider1', rider_name: 'Musa Aliyu', created_at: '2023-10-26T10:00:00Z', pickup_lat: 6.5260, pickup_lng: 3.3800 },
  // FIX: Renamed properties to snake_case
  { id: 'del2', requester_id: 'res2', requester_name: 'Funke Adebayo', pickup_address: 'Gate 2', dropoff_address: 'Block 5, Apt 4B', description: 'Pickup package from DHL', estimated_cost: 700, status: DeliveryStatus.IN_TRANSIT, rider_id: 'rider2', rider_name: 'David Jones', created_at: '2023-10-27T11:30:00Z', pickup_lat: 6.5275, pickup_lng: 3.3815 },
  // FIX: Renamed properties to snake_case
  { id: 'del3', requester_id: 'res1', requester_name: 'Chinedu Okoro', pickup_address: 'Laundry Hub', dropoff_address: 'Block 1, Apt 2A', description: 'Collect dry cleaning', estimated_cost: 300, status: DeliveryStatus.PENDING, created_at: '2023-10-27T14:00:00Z', pickup_lat: 6.5248, pickup_lng: 3.3795 },
  // FIX: Renamed properties to snake_case
  { id: 'del4', requester_id: 'res2', requester_name: 'Funke Adebayo', pickup_address: 'Block 5, Apt 4B', dropoff_address: 'Estate Post Office', description: 'Mail a letter', estimated_cost: 200, status: DeliveryStatus.PENDING, created_at: '2023-10-28T09:00:00Z', pickup_lat: 6.5235, pickup_lng: 3.3805 },
  // FIX: Renamed properties to snake_case
  { id: 'del5', requester_id: 'res3', requester_name: 'Ngozi Eze', pickup_address: 'Block 2, Apt 1C', dropoff_address: '123, Main Street', description: 'Deliver package to external rider', status: DeliveryStatus.AWAITING_GATE_PASS, created_at: '2023-10-29T10:00:00Z', pickup_lat: 6.5255, pickup_lng: 3.3795 },
];

export const GATE_PASSES: GatePass[] = [
  // FIX: Renamed properties to snake_case
  // FIX: Added missing 'created_at' property.
  { id: 'gp1', resident_id: 'res1', resident_name: 'Chinedu Okoro', visitor_name: 'Femi Adekunle (Plumber)', visitor_type: Role.SERVICE_PROVIDER, purpose: 'Fix leaking kitchen sink', visit_date_time: '2023-10-28T10:00:00Z', status: GatePassStatus.PENDING, qr_code: 'pending', created_at: '2023-10-28T09:58:00Z' },
  // FIX: Renamed properties to snake_case
  // FIX: Added missing 'created_at' property.
  { id: 'gp2', resident_id: 'res2', resident_name: 'Funke Adebayo', visitor_name: 'Jumia Delivery', visitor_type: Role.DISPATCH_RIDER, purpose: 'Deliver online order', visit_date_time: '2023-10-27T15:00:00Z', status: GatePassStatus.APPROVED, qr_code: 'QR_CODE_XYZ789', created_at: '2023-10-27T14:59:00Z' },
  // FIX: Renamed properties to snake_case
  // FIX: Added missing 'created_at' property.
  { id: 'gp3', resident_id: 'res1', resident_name: 'Chinedu Okoro', visitor_name: 'Family Visit', visitor_type: Role.RESIDENT, purpose: 'Visiting family', visit_date_time: '2023-10-26T18:00:00Z', status: GatePassStatus.USED, qr_code: 'QR_CODE_ABC123', created_at: '2023-10-26T17:55:00Z' },
  // FIX: Renamed properties to snake_case
  // FIX: Added missing 'created_at' property and stabilized visit_date_time.
  { id: 'gp4', resident_id: 'res3', resident_name: 'Ngozi Eze', visitor_name: 'David Jones', visitor_type: Role.DISPATCH_RIDER, purpose: 'Delivery Pickup for job #del5', visit_date_time: '2023-10-29T10:00:00Z', status: GatePassStatus.PENDING, qr_code: 'pending', target_visitor_id: 'rider2', linked_delivery_id: 'del5', created_at: '2023-10-29T09:59:00Z' },
];

export const ANNOUNCEMENTS: Announcement[] = [
    // FIX: Renamed createdAt to created_at
    { id: 'ann1', title: 'Security Update', content: 'Please be informed that the main gate will be closed for maintenance from 10 PM to 5 AM on Friday.', created_at: '2023-10-25T08:00:00Z' },
    // FIX: Renamed createdAt to created_at
    { id: 'ann2', title: 'Community Meeting', content: 'There will be a general residents meeting on Sunday at the community hall at 4 PM. Your attendance is crucial.', created_at: '2023-10-26T12:00:00Z' },
];

export const CONVERSATIONS: Conversation[] = [
    // FIX: Renamed participantIds to participant_ids and restructured lastMessage
    { id: 'conv1', participant_ids: ['res1', 'store1'], last_message_text: 'Do you have fresh tomatoes?', last_message_timestamp: '2023-10-28T09:05:00Z' },
    // FIX: Renamed participantIds to participant_ids and restructured lastMessage
    { id: 'conv2', participant_ids: ['res2', 'rider2'], last_message_text: 'I am at the gate now.', last_message_timestamp: '2023-10-27T11:32:00Z' },
    // FIX: Renamed participantIds to participant_ids and restructured lastMessage
    { id: 'conv3', participant_ids: ['res1', 'rider1'], last_message_text: 'Thanks for the delivery!', last_message_timestamp: '2023-10-26T10:15:00Z' },
];

export const MESSAGES: Message[] = [
    // Conversation 1: Chinedu & Mama Chi's Groceries
    // FIX: Renamed conversationId to conversation_id, senderId to sender_id, receiverId to receiver_id
    { id: 'msg1', conversation_id: 'conv1', sender_id: 'res1', receiver_id: 'store1', text: 'Good morning, do you have fresh tomatoes?', timestamp: '2023-10-28T09:05:00Z', read: true },
    // FIX: Renamed conversationId to conversation_id, senderId to sender_id, receiverId to receiver_id
    { id: 'msg2', conversation_id: 'conv1', sender_id: 'store1', receiver_id: 'res1', text: 'Yes we do, plenty of them!', timestamp: '2023-10-28T09:06:00Z', read: true },
    // FIX: Renamed conversationId to conversation_id, senderId to sender_id, receiverId to receiver_id
    { id: 'msg3', conversation_id: 'conv1', sender_id: 'res1', receiver_id: 'store1', text: 'Great, I will send a rider to pick some up.', timestamp: '2023-10-28T09:07:00Z', read: false },
    
    // Conversation 2: Funke & David Jones
    // FIX: Renamed conversationId to conversation_id, senderId to sender_id, receiverId to receiver_id
    { id: 'msg4', conversation_id: 'conv2', sender_id: 'res2', receiver_id: 'rider2', text: 'Hi David, are you close?', timestamp: '2023-10-27T11:30:00Z', read: true },
    // FIX: Renamed conversationId to conversation_id, senderId to sender_id, receiverId to receiver_id
    { id: 'msg5', conversation_id: 'conv2', sender_id: 'rider2', receiver_id: 'res2', text: 'Yes, almost at the estate gate.', timestamp: '2023-10-27T11:31:00Z', read: true },
    // FIX: Renamed conversationId to conversation_id, senderId to sender_id, receiverId to receiver_id
    { id: 'msg6', conversation_id: 'conv2', sender_id: 'rider2', receiver_id: 'res2', text: 'I am at the gate now.', timestamp: '2023-10-27T11:32:00Z', read: false },
    
    // Conversation 3: Chinedu & Musa Aliyu
    // FIX: Renamed conversationId to conversation_id, senderId to sender_id, receiverId to receiver_id
    { id: 'msg7', conversation_id: 'conv3', sender_id: 'res1', receiver_id: 'rider1', text: 'Thanks for the delivery!', timestamp: '2023-10-26T10:15:00Z', read: true },
    // FIX: Renamed conversationId to conversation_id, senderId to sender_id, receiverId to receiver_id
    { id: 'msg8', conversation_id: 'conv3', sender_id: 'rider1', receiver_id: 'res1', text: 'You are welcome!', timestamp: '2023-10-26T10:16:00Z', read: true },
];