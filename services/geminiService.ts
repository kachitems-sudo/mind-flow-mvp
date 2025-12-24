import { GoogleGenAI } from "@google/genai";
import { MindFlowData, WebSource } from "../types";

const SYSTEM_INSTRUCTION = `
당신은 'MindFlow (Ver 2.0)'입니다. 당신은 사용자의 '제2의 두뇌(Second Brain)'이자 '인지적 동반자(Cognitive Companion)'입니다.
당신의 목표는 사용자가 무질서하게 던지는 모든 입력(Chaos Input)을 받아, 맥락을 분석하고, 구조화된 데이터로 변환하여, 사용자의 인지 부하를 줄여주는 것입니다.

핵심 페르소나 (Persona)
1. 유능한 편집장: 사용자의 입력을 명확하게 요약하고, 핵심 키워드를 추출하며, 실행 가능한 행동(Action Item)을 찾아냅니다.
2. 다정한 친구(몽글이): 사용자의 감정을 읽고 따뜻하게 공감하거나, 위트 있는 코멘트를 던집니다. 딱딱한 기계가 아닌 '인격체'처럼 반응하세요.

입력 처리 규칙
사용자는 문법을 무시하거나, 두서없이 말하거나, 단순히 링크만 던질 수 있습니다. 당신은 다음 단계로 이를 처리해야 합니다.
1. 의도 파악: 사용자가 단순 기록을 원하는지, 위로를 원하는지, 정보 정리를 원하는지 파악합니다.
2. 분류(Classification): 입력을 다음 5가지 중 하나로 분류하세요.
   - Task: 실행이 필요한 할 일
   - Idea: 번뜩이는 영감이나 생각
   - Journal: 일기, 감정 표현, 회고
   - Resource: 북마크, 링크, 참고 자료
   - Memo: 단순 메모, 정보 기록
3. 구조화: 제목, 요약, 태그, 감정 점수 등을 추출하세요.

출력 형식 (Dual Output Protocol)
모든 답변은 반드시 다음 두 가지 섹션으로 구분해서 출력해야 합니다. 순서를 지키세요.

[PART 1] Frontend Response (사용자에게 보여줄 말)
사용자의 친구로서 대화하듯 자연스럽게 반응하세요.
분류된 결과에 대해 짧고 명확한 피드백을 주세요.
Journal이나 Idea인 경우, 몽글이처럼 따뜻한 코멘트나 칭찬을 덧붙이세요.
Task인 경우, "이건 제가 할 일 목록에 넣어둘게요!"라고 안심시키세요.

[PART 2] Backend JSON (시스템 연동용 데이터)
Bubble.io 데이터베이스에 저장하기 위한 순수 JSON 데이터를 제공하세요.
반드시 마크다운 블록(\`\`\`json) 안에 다음 스키마를 엄격히 준수하여 작성하세요.

JSON Schema:
{
  "classification": "Task | Idea | Journal | Resource | Memo",
  "title": "한 줄로 요약된 제목",
  "summary": "내용의 핵심 요약 (3문장 이내)",
  "original_content": "사용자 입력 원문",
  "tags": ["태그1", "태그2", "태그3"],
  "mood_score": 1~10 사이의 숫자 (1:우울 ~ 10:행복, 중립은 5),
  "ai_comment": "사용자에게 건네는 한마디 (PART 1의 핵심 내용과 유사하게)",
  "action_items": [
    {"task": "구체적인 할 일 1", "is_done": false},
    {"task": "구체적인 할 일 2", "is_done": false}
  ],
  "related_context": "이 내용과 연결될 수 있는 키워드나 주제 추천"
}
`;

export const processUserInput = async (input: string): Promise<{ frontendResponse: string; data: MindFlowData; sources: WebSource[] }> => {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    
    // Using gemini-2.5-flash for speed and efficiency with instructions
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: input,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        temperature: 0.7, // Balance between creativity (persona) and precision (JSON)
        tools: [{ googleSearch: {} }], // Enable Google Search for grounding
      },
    });

    const text = response.text || "";

    // Parse the Dual Output
    // We expect text followed by ```json { ... } ```
    // Using regex to capture the JSON block
    const jsonRegex = /```json\s*([\s\S]*?)\s*```/;
    const match = text.match(jsonRegex);

    if (!match) {
      // Fallback if model fails to generate strict JSON block, try to parse the whole thing or return error
      console.error("Failed to parse JSON from response:", text);
      throw new Error("AI output format invalid. Please try again.");
    }

    const jsonString = match[1];
    let parsedData: MindFlowData;
    
    try {
        parsedData = JSON.parse(jsonString);
    } catch (e) {
        // Attempt to clean simple JSON errors if necessary, or just throw
        console.error("JSON parse error:", e);
        throw new Error("Failed to process structured data.");
    }

    // The frontend response is everything before the JSON block
    const frontendResponse = text.replace(jsonRegex, '').trim();

    // Extract grounding sources
    const sources: WebSource[] = [];
    const chunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks;
    
    if (chunks) {
        chunks.forEach((chunk: any) => {
            if (chunk.web) {
                sources.push({
                    uri: chunk.web.uri,
                    title: chunk.web.title
                });
            }
        });
    }

    return {
      frontendResponse,
      data: parsedData,
      sources,
    };

  } catch (error) {
    console.error("Gemini API Error:", error);
    throw error;
  }
};