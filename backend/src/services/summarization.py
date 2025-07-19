from langchain_openai import ChatOpenAI
from langchain.prompts import ChatPromptTemplate
from langchain.schema import HumanMessage, SystemMessage
from langchain.text_splitter import RecursiveCharacterTextSplitter
from typing import List, Optional
from ..core.config import settings
from ..core.logging import get_logger

logger = get_logger("summarization")


class SummarizationService:
    def __init__(self):
        self.llm = None
        self.text_splitter = RecursiveCharacterTextSplitter(
            chunk_size=4000,
            chunk_overlap=200,
            length_function=len,
        )

    def _get_llm(self):
        """Get or create LLM instance"""
        if self.llm is None:
            if not settings.openai_api_key:
                raise Exception("OpenAI API key not configured")

            self.llm = ChatOpenAI(
                api_key=settings.openai_api_key,
                model="gpt-3.5-turbo",
                temperature=0.3,
            )
        return self.llm

    async def summarize_text(
        self, text: str, max_length: int = 200, style: str = "concise"
    ) -> dict:
        """
        Summarize text using LangChain and OpenAI

        Args:
            text: Text to summarize
            max_length: Maximum length of summary
            style: Summary style (concise, detailed, bullet_points)

        Returns:
            dict: Summary result with summary text and key points
        """
        try:
            if not text.strip():
                return {
                    "summary": "",
                    "key_points": [],
                    "word_count": 0,
                    "original_length": len(text),
                }

            logger.info(f"Starting summarization. Text length: {len(text)}")

            # Split text if it's too long
            if len(text) > 8000:
                chunks = self.text_splitter.split_text(text)
                logger.info(f"Split text into {len(chunks)} chunks")
                summaries = []

                for chunk in chunks:
                    chunk_summary = await self._summarize_chunk(
                        chunk, max_length // len(chunks), style
                    )
                    summaries.append(chunk_summary)

                # Combine chunk summaries
                combined_summary = " ".join(summaries)
                final_summary = await self._summarize_chunk(
                    combined_summary, max_length, style
                )
            else:
                final_summary = await self._summarize_chunk(text, max_length, style)

            # Extract key points
            key_points = await self._extract_key_points(text)

            logger.info("Summarization completed successfully")

            return {
                "summary": final_summary,
                "key_points": key_points,
                "word_count": len(final_summary.split()),
                "original_length": len(text),
            }

        except Exception as e:
            logger.error(f"Summarization failed: {e}")
            raise Exception(f"Summarization failed: {str(e)}")

    async def _summarize_chunk(self, text: str, max_length: int, style: str) -> str:
        """Summarize a single text chunk"""
        llm = self._get_llm()

        style_prompts = {
            "concise": "Provide a concise summary in 2-3 sentences.",
            "detailed": "Provide a detailed summary covering all main points.",
            "bullet_points": "Provide a summary in bullet point format.",
        }

        prompt = ChatPromptTemplate.from_messages(
            [
                (
                    "system",
                    f"You are a helpful assistant that summarizes text. {style_prompts.get(style, style_prompts['concise'])} Keep the summary under {max_length} words.",
                ),
                ("human", "{text}"),
            ]
        )

        messages = prompt.format_messages(text=text)
        response = await llm.agenerate([messages])

        return response.generations[0][0].text.strip()

    async def _extract_key_points(self, text: str) -> List[str]:
        """Extract key points from text"""
        llm = self._get_llm()

        prompt = ChatPromptTemplate.from_messages(
            [
                (
                    "system",
                    "Extract 3-5 key points from the following text. Return them as a simple list.",
                ),
                ("human", "{text}"),
            ]
        )

        messages = prompt.format_messages(text=text)
        response = await llm.agenerate([messages])

        # Parse response into list
        response_text = response.generations[0][0].text.strip()
        key_points = [
            point.strip().lstrip("- ").lstrip("* ")
            for point in response_text.split("\n")
            if point.strip()
        ]

        return key_points[:5]  # Limit to 5 key points


# Global instance
summarization_service = SummarizationService()
