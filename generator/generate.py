import pycantonese

if __name__ == "__main__":
    result = []
    with open("files/song1.txt", "r") as f:
        for line in f:
            for word in line:
                if word == "\n" or word == " " or word == "":
                    result.append({"answer": " ", "value": " "})
                    continue
                pingying = pycantonese.characters_to_jyutping(word)
                pingying = pingying[0]
                result.append({"answer": pingying[1][:-1], "value": word})
    # dump to json with chinese character
    import json
    with open("files/output/song1.json", "w") as f:
        json.dump(result, f, ensure_ascii=False)
