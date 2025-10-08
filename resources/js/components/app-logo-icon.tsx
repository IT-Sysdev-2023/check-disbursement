import { SVGAttributes } from 'react';

export default function AppLogoIcon(props: SVGAttributes<SVGElement>) {
    return (
        <svg {...props}
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
            fill="#000000"
        >
            <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
            <g
                id="SVGRepo_tracerCarrier"
                stroke-linecap="round"
                stroke-linejoin="round"
            ></g>
            <g id="SVGRepo_iconCarrier">
                {' '}
                <defs>
                    {' '}
                    <path
                        id="check-a"
                        d="M4.29289322,0.292893219 C4.68341751,-0.0976310729 5.31658249,-0.0976310729 5.70710678,0.292893219 C6.09763107,0.683417511 6.09763107,1.31658249 5.70710678,1.70710678 L1.90917969,5.46118164 C1.5186554,5.85170593 0.885490417,5.85170593 0.494966125,5.46118164 C0.104441833,5.07065735 0.104441833,4.43749237 0.494966125,4.04696808 L4.29289322,0.292893219 Z"
                    ></path>{' '}
                    <path
                        id="check-c"
                        d="M10.7071068,13.2928932 C11.0976311,13.6834175 11.0976311,14.3165825 10.7071068,14.7071068 C10.3165825,15.0976311 9.68341751,15.0976311 9.29289322,14.7071068 L0.292893219,5.70710678 C-0.0976310729,5.31658249 -0.0976310729,4.68341751 0.292893219,4.29289322 L4.29289322,0.292893219 C4.68341751,-0.0976310729 5.31658249,-0.0976310729 5.70710678,0.292893219 C6.09763107,0.683417511 6.09763107,1.31658249 5.70710678,1.70710678 L2.41421356,5 L10.7071068,13.2928932 Z"
                    ></path>{' '}
                </defs>{' '}
                <g fill="none" fill-rule="evenodd" transform="rotate(-90 11 7)">
                    {' '}
                    <g transform="translate(1 1)">
                        {' '}
                        <mask id="check-b" fill="#ffffff">
                            {' '}
                            <use href="#check-a"></use>{' '}
                        </mask>{' '}
                        <use
                            fill="#D8D8D8"
                            fill-rule="nonzero"
                            href="#check-a"
                        ></use>{' '}
                        <g fill="#FFA0A0" mask="url(#check-b)">
                            {' '}
                            <rect
                                width="24"
                                height="24"
                                transform="translate(-7 -5)"
                            ></rect>{' '}
                        </g>{' '}
                    </g>{' '}
                    <mask id="check-d" fill="#ffffff">
                        {' '}
                        <use href="#check-c"></use>{' '}
                    </mask>{' '}
                    <use
                        fill="#000000"
                        fill-rule="nonzero"
                        href="#check-c"
                    ></use>{' '}
                    <g fill="#7600FF" mask="url(#check-d)">
                        {' '}
                        <rect
                            width="24"
                            height="24"
                            transform="translate(-6 -4)"
                        ></rect>{' '}
                    </g>{' '}
                </g>{' '}
            </g>
        </svg>
        // <svg {...props} viewBox="0 0 40 42" xmlns="http://www.w3.org/2000/svg">
        //     <path
        //         fillRule="evenodd"
        //         clipRule="evenodd"
        //         d="M17.2 5.63325L8.6 0.855469L0 5.63325V32.1434L16.2 41.1434L32.4 32.1434V23.699L40 19.4767V9.85547L31.4 5.07769L22.8 9.85547V18.2999L17.2 21.411V5.63325ZM38 18.2999L32.4 21.411V15.2545L38 12.1434V18.2999ZM36.9409 10.4439L31.4 13.5221L25.8591 10.4439L31.4 7.36561L36.9409 10.4439ZM24.8 18.2999V12.1434L30.4 15.2545V21.411L24.8 18.2999ZM23.8 20.0323L29.3409 23.1105L16.2 30.411L10.6591 27.3328L23.8 20.0323ZM7.6 27.9212L15.2 32.1434V38.2999L2 30.9666V7.92116L7.6 11.0323V27.9212ZM8.6 9.29991L3.05913 6.22165L8.6 3.14339L14.1409 6.22165L8.6 9.29991ZM30.4 24.8101L17.2 32.1434V38.2999L30.4 30.9666V24.8101ZM9.6 11.0323L15.2 7.92117V22.5221L9.6 25.6333V11.0323Z"
        //     />
        // </svg>
    );
}
