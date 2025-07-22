"use client";
import React from "react";
import Copy from "./Copy";
import AnimatedLink from "./AnimatedLink";

export default function Footer() {
  return (
    <footer>
      <div className="contents">
        <div className="contact-info">
          <Copy>
            <p>1111b South Governors Ave, STE 28822 Dover, DE, 19904 US</p>
          </Copy>
          <a href="mailto:Hello@metnov.org?subject=I%20have%20an%20enquiry">
            Hello@metnov.org
          </a>
        </div>
        <div className="link">
          <div className="link-col">
            <h4>Quick Links</h4>
            <div className="link-menu">
              <AnimatedLink href="#" text="About" />
              <AnimatedLink href="#" text="Journal" />
              <AnimatedLink href="#" text="Brochure" />
              <AnimatedLink href="#" text="Contact" />
              <AnimatedLink href="#" text="Proposal" />
            </div>
          </div>
          <div className="link-col">
            <h4>Socials</h4>
            <div className="link-menu">
              <AnimatedLink
                href="https://www.facebook.com/share/15mHvRNdcV/?mibextid=wwXIfr "
                text="Facebook"
              />
              <AnimatedLink href="#" text="Instagram" />
              <AnimatedLink
                href="https://www.linkedin.com/company/metnov "
                text="LinkedIn"
              />
              <AnimatedLink href="#" text="Tiktok" />
              <AnimatedLink href="#" text="X" />
            </div>
          </div>
        </div>
      </div>
      <div className="logo">
        <svg
          width="1472"
          height="333"
          viewBox="0 0 1472 333"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="logo-big"
        >
          <g id="Logo-big-light" clipPath="url(#clip0_172_182)">
            <path
              id="e"
              d="M477.151 79.0099C537.553 79.0099 576.079 115.688 576.079 177.737V191.836H420.721C422.323 228.514 441.377 255.121 479.137 255.121C510.905 255.121 529.994 239.397 536.334 213.602H576.845C569.286 252.294 540.688 288.16 479.903 288.16C414.729 288.16 380.174 241.411 380.174 181.341C380.174 116.465 419.501 78.9746 477.116 78.9746L477.151 79.0099ZM535.95 164.839C533.582 130.564 510.905 111.236 477.534 111.236C446.532 111.236 423.507 130.564 420.721 164.839H535.95Z"
              fill="#FDE9E4"
            />
            <path
              id="t"
              d="M752.476 284.131H669.851C650.379 284.131 640.835 274.449 640.835 254.697V118.868H596.352V83.0027H640.835V22.1553H681.764V83.0027H744.534V118.868H681.764V248.231H752.476V284.096V284.131Z"
              fill="#FDE9E4"
            />
            <path
              id="o"
              d="M1139.06 79.0098C1201.83 79.0098 1245.55 121.73 1245.55 183.39C1245.55 245.05 1201.83 288.195 1139.06 288.195C1076.29 288.195 1032.19 245.474 1032.19 183.39C1032.19 121.306 1075.91 79.0098 1139.06 79.0098ZM1139.06 252.294C1180.79 252.294 1204.23 222.471 1204.23 183.39C1204.23 144.309 1180.79 114.875 1139.06 114.875C1097.33 114.875 1073.12 144.698 1073.12 183.39C1073.12 222.082 1096.95 252.294 1139.06 252.294Z"
              fill="#FDE9E4"
            />
            <path
              id="v"
              d="M1472 83.0381L1411.6 284.167H1326.19L1264.98 83.0381H1306.3L1363.49 272.859H1374.6L1431.42 83.0381H1471.93H1472Z"
              fill="#FDE9E4"
            />
            <path
              id="n"
              d="M915.776 79.0098C961.861 79.0098 991.68 107.208 991.68 165.264V248.407H1015.09V284.131H991.68V284.167H950.75V170.917C950.75 130.599 936.05 114.91 903.062 114.91C863.317 114.91 835.903 144.345 835.903 198.726V284.167H794.974V118.762H771.53V83.0381H835.903V114.875L828.763 141.482H839.874C847.816 105.193 872.862 79.0099 915.776 79.0098Z"
              fill="#FDE9E4"
            />
            <path
              id="M"
              d="M173.959 272.436H185.489L251.464 0H335.691V248.407H360.075V284.131H270.623V248.407H293.194V56.0068L300.754 11.6611H289.224L221.682 284.096H137.453L69.876 11.6963H58.3467L65.9053 56.042V248.407H89.4531V284.131H65.9053V284.167H23.4082V284.131H0V248.407H23.4082V0H108.02L173.959 272.436Z"
              fill="#FDE9E4"
            />
            <path
              id="dot"
              d="M1138.68 301.057C1121.3 301.057 1107.19 315.367 1107.19 333H1170.13C1170.13 315.367 1156.02 301.057 1138.64 301.057H1138.68Z"
              fill="#FDE9E4"
            />
          </g>
          <defs>
            <clipPath id="clip0_172_182">
              <rect width="1472" height="333" fill="white" />
            </clipPath>
          </defs>
        </svg>
      </div>
    </footer>
  );
}
