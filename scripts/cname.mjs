// Writes dist/CNAME from SITE_CNAME (defaults to the Eclipse Productions domain).
import { writeFileSync } from "node:fs";
writeFileSync("dist/CNAME", (process.env.SITE_CNAME || "eclipseproductionsllc.com") + "\n");
console.log("CNAME:", process.env.SITE_CNAME || "eclipseproductionsllc.com");
