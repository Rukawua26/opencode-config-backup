import { tool } from "@opencode-ai/plugin"
import fs from "fs"
import path from "path"

export default tool({
  description:
    "Consultar un agente especializado (trading, backend, frontend, design, android) via modelos locales en Ollama",
  args: {
    especialidad: tool.schema
      .string()
      .describe("Perfil: trading, backend, frontend, design, android"),
    mensaje: tool.schema.string().describe("Consulta del usuario"),
    contexto: tool.schema
      .string()
      .optional()
      .describe("Categorías de contexto separadas por coma (ej: pares_cripto,reglas_trading)"),
  },
  async execute(args, ctx) {
    const script = [
      path.join(ctx.worktree, "main.py"),
      path.join(ctx.worktree, "agent_orchestrator", "main.py"),
      path.join(ctx.directory, "main.py"),
      path.join(ctx.directory, "agent_orchestrator", "main.py"),
      "/home/miguel/Agente proyect/agent_orchestrator/main.py",
    ].find((candidate) => fs.existsSync(candidate))

    if (!script) {
      return "No encontré main.py de agent_orchestrator desde el directorio actual de OpenCode. Abre OpenCode desde la carpeta del proyecto o desde agent_orchestrator/."
    }

    const contextoArgs = args.contexto
      ? ["--contexto", ...args.contexto.split(",").map((c) => c.trim()).filter(Boolean)]
      : []
    const mensaje = `${args.mensaje}\n\nResponde completo y conciso en máximo 180 palabras.`

    const proc = await Bun.$`python3 ${script} --especialidad ${args.especialidad} --mensaje ${mensaje} --stream --max-tokens 350 ${contextoArgs}`.nothrow()
    const stdout = proc.stdout.toString().trim()
    const stderr = proc.stderr.toString().trim()

    if (proc.exitCode !== 0) {
      return `agent-consult falló con código ${proc.exitCode}.\n${stderr || stdout || "Sin salida del proceso."}`
    }

    return stdout
  },
})
