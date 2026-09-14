import {
  BarChart3,
  Barcode,
  Bell,
  Boxes,
  Briefcase,
  Building2,
  ChartLine,
  Coins,
  GraduationCap,
  PackageCheck,
  Presentation,
  RotateCcw,
  ScanBarcode,
  Send,
  ShieldCheck,
  Users,
} from 'lucide-react'

// What the system does and who uses it — shared by the landing page and the
// login page so the two never drift apart.

export const features = [
  {
    icon: Boxes,
    title: 'Item & Inventory Records',
    description:
      'Catalogue every asset with its device ID, brand, model, category, price, MR, and photo, and track whether it is available, borrowed, under maintenance, or damaged.',
  },
  {
    icon: Barcode,
    title: 'Barcode Labels',
    description:
      'Generate and print barcode labels for items so every unit can be identified with a quick scan.',
  },
  {
    icon: ScanBarcode,
    title: 'Scan-to-Count Inventory',
    description:
      'Count stock by scanning labels with a phone camera or a handheld scanner, then print the inventory count report.',
  },
  {
    icon: Send,
    title: 'Borrow Requests & Approval',
    description:
      'Faculty, staff, and students request items with a due date and purpose. The administrator approves or rejects each one with a note.',
  },
  {
    icon: PackageCheck,
    title: 'Hand-over Receipts',
    description:
      'Record who actually picked up the item, the ID they showed, its condition, and a photo taken at the counter.',
  },
  {
    icon: RotateCcw,
    title: 'Returns & Condition Check',
    description:
      'Log returns with the item condition and notes. Stock updates automatically once the item is back.',
  },
  {
    icon: Coins,
    title: 'Overdue Tracking & Fees',
    description:
      'See overdue items as they come up, with late fees computed from a per-day rate, grace days, a cap, and damage or lost-item charges you configure.',
  },
  {
    icon: Building2,
    title: 'Room Assignment',
    description:
      'Link borrowed items to rooms so each unit can be traced to where it is being used.',
  },
  {
    icon: Users,
    title: 'Borrower Profiles',
    description:
      'Keep student, faculty, and staff records with generated IDs, department, year and section, and a full borrowing history.',
  },
  {
    icon: ChartLine,
    title: 'Dashboards & Analytics',
    description:
      'Charts of monthly borrowing and returns, the most borrowed items, and the departments that borrow most.',
  },
  {
    icon: BarChart3,
    title: 'Printable Reports',
    description:
      'Print summaries, most-borrowed lists, and recent activity for audits and turnovers.',
  },
  {
    icon: Bell,
    title: 'Notifications & Mobile App',
    description:
      'The administrator is notified of pending requests right away. The system installs on a phone like an app and shows an offline page when there is no connection.',
  },
]

export const roles = [
  {
    icon: ShieldCheck,
    name: 'Administrator',
    description: 'Runs the property office and oversees the whole system.',
    capabilities: [
      'Manage user accounts',
      'Manage items, rooms, and borrowers',
      'Approve or reject borrow requests',
      'Record hand-overs and returns',
      'Set overdue and damage fees',
      'Print barcodes and scan inventory',
      'View dashboards and print reports',
    ],
  },
  {
    icon: Briefcase,
    name: 'Staff',
    description: 'School personnel who borrow equipment for their work.',
    capabilities: [
      'Request equipment',
      'Track borrowed items',
      'View transaction history',
      'See returned items',
      'Personal dashboard',
    ],
  },
  {
    icon: Presentation,
    name: 'Faculty',
    description: 'Teachers who borrow equipment for classes and activities.',
    capabilities: [
      'Request equipment',
      'Track borrowed items',
      'View transaction history',
      'See returned items',
      'Personal dashboard',
    ],
  },
  {
    icon: GraduationCap,
    name: 'Student',
    description: 'Students who borrow equipment for class projects.',
    capabilities: [
      'Request equipment',
      'Track borrowed items',
      'View transaction history',
      'See returned items',
      'Personal dashboard',
    ],
  },
]
