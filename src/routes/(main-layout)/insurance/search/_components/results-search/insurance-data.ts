export const insurancePlans = [
    {
        id: 1,
        provider: 'Zurich',
        logo: 'simple-icons:zurich',
        logoColor: '#1e40af',
        planName: 'Zurich Travel Insurance Basic',
        coverage: [
            { id: 'worldwide', name: 'Worldwide', checked: true },
            { id: 'usa', name: 'USA', checked: false },
            { id: 'canada', name: 'Canada', checked: false }
        ],
        ageRange: [1, 80],
        type: 'Reimbursement',
        price: 135000,
        currency: 'IDR',
        features: [
            {
                icon: 'material-symbols:flight-takeoff',
                name: 'Delay & Cancellation',
                coverage: '50,000,000 IDR'
            },
            {
                icon: 'material-symbols:luggage',
                name: 'Baggage Protection',
                coverage: '50,000,000 IDR'
            },
            {
                icon: 'material-symbols:medical-services',
                name: 'Accident & Medical Expense',
                coverage: '50,000,000 IDR'
            }
        ],
        premiumCharges: [
            { period: '5 days', charge: '52,000 IDR' },
            { period: '10 days', charge: '85,000 IDR' },
            { period: '15 days', charge: '115,000 IDR' }
        ],
        claimDetails: 'Submit claim documents within 30 days of incident'
    },
    {
        id: 2,
        provider: 'Sompo',
        logo: 'simple-icons:sompo',
        logoColor: '#dc2626',
        planName: 'Sompo Travel Protection Plus',
        coverage: [
            { id: 'worldwide', name: 'Worldwide', checked: true },
            { id: 'usa', name: 'USA', checked: true },
            { id: 'canada', name: 'Canada', checked: true }
        ],
        ageRange: [1, 75],
        type: 'Cashless',
        price: 185000,
        currency: 'IDR',
        features: [
            {
                icon: 'material-symbols:flight-takeoff',
                name: 'Delay & Cancellation',
                coverage: '75,000,000 IDR'
            },
            {
                icon: 'material-symbols:luggage',
                name: 'Baggage Protection',
                coverage: '60,000,000 IDR'
            },
            {
                icon: 'material-symbols:medical-services',
                name: 'Accident & Medical Expense',
                coverage: '100,000,000 IDR'
            }
        ],
        premiumCharges: [
            { period: '5 days', charge: '75,000 IDR' },
            { period: '10 days', charge: '125,000 IDR' },
            { period: '15 days', charge: '165,000 IDR' }
        ],
        claimDetails: 'Cashless claims at network hospitals worldwide'
    },
    {
        id: 3,
        provider: 'Mega',
        logo: 'mdi:bank',
        logoColor: '#059669',
        planName: 'Mega Travel Shield Premium',
        coverage: [
            { id: 'worldwide', name: 'Worldwide', checked: true },
            { id: 'usa', name: 'USA', checked: false },
            { id: 'canada', name: 'Canada', checked: false }
        ],
        ageRange: [1, 70],
        type: 'Reimbursement',
        price: 225000,
        currency: 'IDR',
        features: [
            {
                icon: 'material-symbols:flight-takeoff',
                name: 'Delay & Cancellation',
                coverage: '100,000,000 IDR'
            },
            {
                icon: 'material-symbols:luggage',
                name: 'Baggage Protection',
                coverage: '80,000,000 IDR'
            },
            {
                icon: 'material-symbols:medical-services',
                name: 'Accident & Medical Expense',
                coverage: '150,000,000 IDR'
            }
        ],
        premiumCharges: [
            { period: '5 days', charge: '95,000 IDR' },
            { period: '10 days', charge: '165,000 IDR' },
            { period: '15 days', charge: '225,000 IDR' }
        ],
        claimDetails: 'Email claims documents with response within 48 hours'
    },
    {
        id: 4,
        provider: 'Tokio Marine',
        logo: 'simple-icons:tokiomarine',
        logoColor: '#7c3aed',
        planName: 'Tokio Marine Global Coverage',
        coverage: [
            { id: 'worldwide', name: 'Worldwide', checked: true },
            { id: 'usa', name: 'USA', checked: true },
            { id: 'canada', name: 'Canada', checked: true }
        ],
        ageRange: [1, 85],
        type: 'Cashless',
        price: 295000,
        currency: 'IDR',
        features: [
            {
                icon: 'material-symbols:flight-takeoff',
                name: 'Delay & Cancellation',
                coverage: '120,000,000 IDR'
            },
            {
                icon: 'material-symbols:luggage',
                name: 'Baggage Protection',
                coverage: '100,000,000 IDR'
            },
            {
                icon: 'material-symbols:medical-services',
                name: 'Accident & Medical Expense',
                coverage: '200,000,000 IDR'
            }
        ],
        premiumCharges: [
            { period: '5 days', charge: '125,000 IDR' },
            { period: '10 days', charge: '215,000 IDR' },
            { period: '15 days', charge: '295,000 IDR' }
        ],
        claimDetails: '24/7 multilingual claims assistance'
    },
    {
        id: 5,
        provider: 'Sahabat',
        logo: 'mdi:handshake',
        logoColor: '#ea580c',
        planName: 'Sahabat Travel Care Elite',
        coverage: [
            { id: 'worldwide', name: 'Worldwide', checked: true },
            { id: 'usa', name: 'USA', checked: false },
            { id: 'canada', name: 'Canada', checked: false }
        ],
        ageRange: [1, 65],
        type: 'Reimbursement',
        price: 165000,
        currency: 'IDR',
        features: [
            {
                icon: 'material-symbols:flight-takeoff',
                name: 'Delay & Cancellation',
                coverage: '65,000,000 IDR'
            },
            {
                icon: 'material-symbols:luggage',
                name: 'Baggage Protection',
                coverage: '55,000,000 IDR'
            },
            {
                icon: 'material-symbols:medical-services',
                name: 'Accident & Medical Expense',
                coverage: '80,000,000 IDR'
            }
        ],
        premiumCharges: [
            { period: '5 days', charge: '65,000 IDR' },
            { period: '10 days', charge: '115,000 IDR' },
            { period: '15 days', charge: '165,000 IDR' }
        ],
        claimDetails: 'Local agent support in major cities'
    },
    {
        id: 6,
        provider: 'Allianz',
        logo: 'simple-icons:allianz',
        logoColor: '#0369a1',
        planName: 'Allianz Travel Secure Gold',
        coverage: [
            { id: 'worldwide', name: 'Worldwide', checked: true },
            { id: 'usa', name: 'USA', checked: true },
            { id: 'canada', name: 'Canada', checked: true }
        ],
        ageRange: [1, 80],
        type: 'Cashless',
        price: 245000,
        currency: 'IDR',
        features: [
            {
                icon: 'material-symbols:flight-takeoff',
                name: 'Delay & Cancellation',
                coverage: '110,000,000 IDR'
            },
            {
                icon: 'material-symbols:luggage',
                name: 'Baggage Protection',
                coverage: '90,000,000 IDR'
            },
            {
                icon: 'material-symbols:medical-services',
                name: 'Accident & Medical Expense',
                coverage: '180,000,000 IDR'
            }
        ],
        premiumCharges: [
            { period: '5 days', charge: '105,000 IDR' },
            { period: '10 days', charge: '185,000 IDR' },
            { period: '15 days', charge: '245,000 IDR' }
        ],
        claimDetails: 'Mobile app for instant claims submission'
    },
    {
        id: 7,
        provider: 'AIG',
        logo: 'simple-icons:aig',
        logoColor: '#4338ca',
        planName: 'AIG Travel Guard Standard',
        coverage: [
            { id: 'worldwide', name: 'Worldwide', checked: true },
            { id: 'usa', name: 'USA', checked: false },
            { id: 'canada', name: 'Canada', checked: false }
        ],
        ageRange: [1, 75],
        type: 'Reimbursement',
        price: 195000,
        currency: 'IDR',
        features: [
            {
                icon: 'material-symbols:flight-takeoff',
                name: 'Delay & Cancellation',
                coverage: '85,000,000 IDR'
            },
            {
                icon: 'material-symbols:luggage',
                name: 'Baggage Protection',
                coverage: '70,000,000 IDR'
            },
            {
                icon: 'material-symbols:medical-services',
                name: 'Accident & Medical Expense',
                coverage: '120,000,000 IDR'
            }
        ],
        premiumCharges: [
            { period: '5 days', charge: '85,000 IDR' },
            { period: '10 days', charge: '145,000 IDR' },
            { period: '15 days', charge: '195,000 IDR' }
        ],
        claimDetails: 'Online claims portal with document upload'
    },
    {
        id: 8,
        provider: 'Chubb',
        logo: 'simple-icons:chubb',
        logoColor: '#1d4ed8',
        planName: 'Chubb Travel Protection',
        coverage: [
            { id: 'worldwide', name: 'Worldwide', checked: true },
            { id: 'usa', name: 'USA', checked: true },
            { id: 'canada', name: 'Canada', checked: true }
        ],
        ageRange: [1, 85],
        type: 'Cashless',
        price: 275000,
        currency: 'IDR',
        features: [
            {
                icon: 'material-symbols:flight-takeoff',
                name: 'Delay & Cancellation',
                coverage: '115,000,000 IDR'
            },
            {
                icon: 'material-symbols:luggage',
                name: 'Baggage Protection',
                coverage: '95,000,000 IDR'
            },
            {
                icon: 'material-symbols:medical-services',
                name: 'Accident & Medical Expense',
                coverage: '190,000,000 IDR'
            }
        ],
        premiumCharges: [
            { period: '5 days', charge: '115,000 IDR' },
            { period: '10 days', charge: '205,000 IDR' },
            { period: '15 days', charge: '275,000 IDR' }
        ],
        claimDetails: 'Direct billing with network providers'
    },
    {
        id: 9,
        provider: 'AXA',
        logo: 'simple-icons:axa',
        logoColor: '#1e3a8a',
        planName: 'AXA Travel Smart',
        coverage: [
            { id: 'worldwide', name: 'Worldwide', checked: true },
            { id: 'usa', name: 'USA', checked: false },
            { id: 'canada', name: 'Canada', checked: false }
        ],
        ageRange: [1, 70],
        type: 'Reimbursement',
        price: 205000,
        currency: 'IDR',
        features: [
            {
                icon: 'material-symbols:flight-takeoff',
                name: 'Delay & Cancellation',
                coverage: '90,000,000 IDR'
            },
            {
                icon: 'material-symbols:luggage',
                name: 'Baggage Protection',
                coverage: '75,000,000 IDR'
            },
            {
                icon: 'material-symbols:medical-services',
                name: 'Accident & Medical Expense',
                coverage: '130,000,000 IDR'
            }
        ],
        premiumCharges: [
            { period: '5 days', charge: '85,000 IDR' },
            { period: '10 days', charge: '155,000 IDR' },
            { period: '15 days', charge: '205,000 IDR' }
        ],
        claimDetails: 'Dedicated claims specialist assigned'
    },
    {
        id: 10,
        provider: 'Manulife',
        logo: 'simple-icons:manulife',
        logoColor: '#be123c',
        planName: 'Manulife Travel Assurance',
        coverage: [
            { id: 'worldwide', name: 'Worldwide', checked: true },
            { id: 'usa', name: 'USA', checked: true },
            { id: 'canada', name: 'Canada', checked: true }
        ],
        ageRange: [1, 80],
        type: 'Cashless',
        price: 255000,
        currency: 'IDR',
        features: [
            {
                icon: 'material-symbols:flight-takeoff',
                name: 'Delay & Cancellation',
                coverage: '105,000,000 IDR'
            },
            {
                icon: 'material-symbols:luggage',
                name: 'Baggage Protection',
                coverage: '85,000,000 IDR'
            },
            {
                icon: 'material-symbols:medical-services',
                name: 'Accident & Medical Expense',
                coverage: '175,000,000 IDR'
            }
        ],
        premiumCharges: [
            { period: '5 days', charge: '105,000 IDR' },
            { period: '10 days', charge: '185,000 IDR' },
            { period: '15 days', charge: '255,000 IDR' }
        ],
        claimDetails: '24-hour emergency assistance hotline'
    }
];