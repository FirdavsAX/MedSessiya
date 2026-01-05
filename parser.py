import re
import json
from docx import Document

def read_docx_text(path):
    doc = Document(path)
    lines = []
    for p in doc.paragraphs:
        text = p.text.strip()
        if text:
            lines.append(text)
    return "\n".join(lines)

def normalize_questions(raw_text):
    # Regex to find: (Number.) (Question Text) { (Answer Block) }
    # Accounts for multi-line questions and answer blocks
    pattern = re.compile(r"(?:(\d+)\.\s*)?([\s\S]+?)\s*\{([\s\S]+?)\}", re.MULTILINE)
    
    questions = []
    q_id = 1

    for match in pattern.finditer(raw_text):
        # Clean up the question text (remove extra newlines)
        question_text = re.sub(r'\s+', ' ', match.group(2)).strip()
        
        # Get the answer block and split it by the '~' symbol
        answer_block = match.group(3).strip()
        
        # Split by ~ but keep the content. 
        # We look for ~ or % as the starting point of an option
        raw_options = re.split(r'~', answer_block)
        
        answers = []
        for opt in raw_options:
            opt = opt.strip()
            if not opt:
                continue
            
            # Find the weight: supports 100, 0, and 33,333 (with comma)
            # Regex explained: % (digits or comma) % (the remaining text)
            m = re.match(r"%([\d,]+)%\s*([\s\S]+)", opt)
            if m:
                weight_str = m.group(1).replace(',', '.') # Convert 33,333 to 33.333
                weight = float(weight_str)
                answer_text = re.sub(r'\s+', ' ', m.group(2)).strip()
                
                answers.append({
                    "text": answer_text,
                    "correct": weight > 0,
                    "weight": weight
                })

        if answers:
            questions.append({
                "id": q_id,
                "question": question_text,
                "answers": answers
            })
            q_id += 1

    return questions

def main():
    docx_path = "questions.docx" 
    output_json = "questions.json"

    try:
        raw_text = read_docx_text(docx_path)
        questions = normalize_questions(raw_text)

        with open(output_json, "w", encoding="utf-8") as f:
            json.dump(questions, f, ensure_ascii=False, indent=2)

        print(f"✅ Successfully converted {len(questions)} questions to {output_json}")
    except Exception as e:
        print(f"❌ Error: {e}")

if __name__ == "__main__":
    main()