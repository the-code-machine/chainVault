export const NavbarItems =[
   
    {
        name: 'About',
        href: 'about',
       
    },
    {
        name: 'Features',
        href: 'features',
       
    },
    {
        name: 'Legal Records',  
        href: '/dashBoard/legalRecords',
        innerItems: [
            {
                name: 'Upload Documents',
                href: '/dashBoard/legalRecords/uploadDocuments',
            },
            {
                name: 'My Documents',
                href: '/dashBoard/legalRecords/viewDocuments',
            },

           
        ]
      
    },
    {
        name: 'Statics',
        href: '/statics',
      
    },
    {
        name: 'Contact',
        href: 'contact',
      
    },
   
    
]