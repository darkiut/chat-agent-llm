import torch
import torch.nn as nn
import pandas as pd

# Vocabulario pequeño
vocab = {
    "<pad>": 0,
    "<unk>": 1,
    "la": 2,
    "suma": 3,
    "de": 4,
    "un": 5,
    "arreglo": 6,
    "en": 7,
    "php": 8,
    "es": 9,
    "array_sum": 10,
    "hola": 11,
    "como": 12,
    "estas": 13,
    "bien": 14,
    "gracias": 15
}

vocab_size = len(vocab)
token_to_id = vocab
id_to_token = {idx: token for token, idx in token_to_id.items()}


class SimpleLLM(nn.Module):
    def __init__(self, vocab_size, embed_dim=10, hidden_dim=20):
        super().__init__()
        self.embedding = nn.Embedding(vocab_size, embed_dim)
        self.linear = nn.Linear(embed_dim, vocab_size)

    def forward(self, x):
        embeds = self.embedding(x)
        pooled = embeds.mean(dim=1)
        logits = self.linear(pooled)
        return logits


def generate_and_probs(model, prompt_ids, max_len=5, temperature=1.0):
    model.eval()
    generated = prompt_ids.copy()
    probs_table = []

    with torch.no_grad():
        for _ in range(max_len):
            input_ids = torch.tensor([generated])
            logits = model(input_ids)

            next_token_logits = logits[0] / temperature
            probs = torch.softmax(next_token_logits, dim=-1)
            logprobs = torch.log(probs + 1e-8)

            next_token_id = torch.argmax(probs).item()
            generated.append(next_token_id)

            probs_dict = {id_to_token[i]: probs[i].item() for i in range(vocab_size)}
            logprobs_dict = {id_to_token[i]: logprobs[i].item() for i in range(vocab_size)}

            sorted_probs = sorted(
                [(tok, p) for tok, p in probs_dict.items() if tok != id_to_token[next_token_id]],
                key=lambda x: x[1],
                reverse=True
            )

            top1_alt = sorted_probs[0][1] if len(sorted_probs) > 0 else 0.0
            top2_alt = sorted_probs[1][1] if len(sorted_probs) > 1 else 0.0
            top3_alt = sorted_probs[2][1] if len(sorted_probs) > 2 else 0.0

            probs_table.append({
                'Posición': len(generated) - 1,
                'Token generado': id_to_token[next_token_id],
                'Probabilidad': probs[next_token_id].item(),
                'Logprob': logprobs[next_token_id].item(),
                'Top1_alt_prob': top1_alt,
                'Top2_alt_prob': top2_alt,
                'Top3_alt_prob': top3_alt
            })

    return generated, pd.DataFrame(probs_table)


# Inicializar modelo global
model = SimpleLLM(vocab_size)
torch.manual_seed(42)


def process_prompt(prompt: str):
    """Función principal que procesa el prompt"""
    prompt_words = prompt.lower().split()
    prompt_ids = [token_to_id.get(word, token_to_id["<unk>"]) for word in prompt_words]

    generated_ids, table = generate_and_probs(model, prompt_ids)

    tokens_generated = [id_to_token[id] for id in generated_ids]

    return {
        "tokens": tokens_generated,
        "probabilities_table": table.to_dict(orient='records')
    }
