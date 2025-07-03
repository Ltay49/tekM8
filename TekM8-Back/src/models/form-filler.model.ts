import { createCanvas, loadImage } from "canvas";
import fs from "fs";
import path from "path";

interface UserDetails {
  name?: string;
  position?: string;
  date?: string;
  signature?: string;
  projectName?: string;
  projectCode?: string;
  inducteeName?: string;
  // inducteeSignature?: string; ← handled on frontend
}

interface FieldOverlay {
  label: keyof UserDetails;
  x: number;
  y: number;
  fontSize?: number;
}

export const fillFormImage = async (
  imagePath: string,
  userDetails: UserDetails,
  checkedItems: string[] = [],
  outputFileName = "filled-form.png"
): Promise<string> => {
  const img = await loadImage(imagePath);
  const canvas = createCanvas(img.width, img.height);
  const ctx = canvas.getContext("2d");

  ctx.drawImage(img, 0, 0, img.width, img.height);
  ctx.fillStyle = "black";

  const fields: FieldOverlay[] = [
    { label: "name", x: 115, y: 500, fontSize: 18 },
    { label: "position", x: 115, y: 555, fontSize: 18 },
    { label: "date", x: 585, y: 185, fontSize: 18 },
    { label: "signature", x: 115, y: 606, fontSize: 18 },
    { label: "projectCode", x: 445, y: 185, fontSize: 18 },
    { label: "projectName", x: 150, y: 185, fontSize: 18 },
    { label: "inducteeName", x: 380, y: 505, fontSize: 18 }
  ];

  // ✅ Draw user-provided text fields
  fields.forEach((field) => {
    const value = userDetails[field.label];
    if (value) {
      console.log(`🖊 Drawing "${field.label}" = "${value}" at (${field.x}, ${field.y})`);
      ctx.font = `${field.fontSize || 16}px sans-serif`;
      ctx.fillStyle = "black";
      ctx.fillText(value, field.x, field.y);
    }
  });

  // ✅ Checkbox tick positions
  const checkboxFields: { label: string; x: number; y: number }[] = [
    // { label: "Project Name", x: 115, y: 185 },
    { label: "Signed Method Statement", x: 273, y: 292 },
    { label: "Signed RAMS", x: 273, y: 320 },
    { label: "Appropriate PPE", x: 273, y: 345 },
    { label: "Will work safely", x: 273, y: 378},
    { label: "Correct Certs", x: 273, y: 405 },
    { label: "Knows the fire drill", x: 678, y: 280 },
    { label: "Knows appointed First Aider", x: 678, y: 310 },
    { label: "Understands Health & Safety", x: 678, y: 345 },
    { label: "Had the opportunity to ask questions", x: 678, y: 375 },
    { label: "Read and understood", x: 678, y: 405 }
  ];

  // ✅ Draw debug TICKs where matched
  console.log("🔍 Received checkedItems:", checkedItems);
  checkboxFields.forEach((box) => {
    const matched = checkedItems.includes(box.label);
    console.log(`🟩 Checking for "${box.label}" → match: ${matched}`);
    if (matched) {
      ctx.font = "bold 26px Arial";
      ctx.fillStyle = "red";
      ctx.fillText("✓", box.x, box.y); // ✅ For visibility test — replace with "✓" later
    }
  });

  // ✅ Save output image
  const outPath = path.join(path.dirname(imagePath), outputFileName);
  const out = fs.createWriteStream(outPath);
  const stream = canvas.createPNGStream();
  stream.pipe(out);

  return new Promise((resolve, reject) => {
    out.on("finish", () => {
      console.log("✅ Image saved at:", outPath);
      resolve(outPath);
    });
    out.on("error", reject);
  });
};
