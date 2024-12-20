async function validator() {
  return Promise.resolve("1312332");
}

try {
  const result = await validator();
  console.log("🚀 ~ result:", result)

} catch (err) {
  console.log("🚀 ~ err:", err);
}
