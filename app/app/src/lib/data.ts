export interface Contract {
  id: string;
  name: string;
  amount: number;
  files: string[];
  owner: string;
  status: string;
  startDate: Date;
  endDate: Date;
  description: string;
}
export const SAMPLE_CONTRACT: Contract[] = [
  {
    id: "1",
    name: "Infrastructure Development Contract for Smart City Project",
    amount: 100000,
    files: [],
    owner: "",
    status: "progress",
    startDate: new Date(),
    endDate: new Date(),
    description: `
    This contract outlines the agreement between the government and the infrastructure development company for the implementation of critical infrastructure in a smart city project. The project aims to transform the city's infrastructure to support advanced technologies and improve the quality of life for its residents. The contract includes the following key provisions:

    Scope of Work: The contract defines the specific infrastructure development projects to be undertaken, such as building smart roads, installing smart streetlights, implementing an intelligent transportation system, deploying IoT sensors for waste management, etc.
    
    Timeline and Milestones: The contract establishes a timeline for project completion, including specific milestones for each infrastructure component. This ensures timely progress and allows for efficient project monitoring.
    
    Technical Specifications: The contract outlines the technical requirements and standards for the infrastructure development, including connectivity, interoperability, cybersecurity, and data privacy measures. It ensures that the infrastructure is designed and implemented to meet the highest quality and security standards.
    
    Budget and Payment Terms: The contract includes the agreed-upon budget for the infrastructure development project and specifies the payment terms, such as milestone-based payments or periodic installments.
    
    Roles and Responsibilities: The contract clearly defines the roles and responsibilities of the government and the infrastructure development company. It outlines the obligations of each party regarding project management, coordination, reporting, and compliance with regulations.
    
    Change Management: The contract includes provisions for managing changes or modifications to the scope of work, timeline, or budget. It establishes a process for requesting and approving changes and ensures transparency and accountability throughout the project.
    
    Dispute Resolution: The contract includes mechanisms for resolving disputes that may arise during the project implementation. It may specify arbitration, mediation, or other dispute resolution methods to ensure a fair and timely resolution.
    
    This sample infrastructure development contract provides a solid foundation for the implementation of infrastructure projects in our app's dummy data. It covers essential aspects related to project scope, timeline, technical specifications, budget, roles, and dispute resolution.
    `,
  },
];
