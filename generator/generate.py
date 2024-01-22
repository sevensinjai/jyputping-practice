import pycantonese

if __name__ == "__main__":
    result = []
    with open("files/song2.txt", "r") as f:
        for line in f:
            for word in line:
                if word == "\n" or word == " " or word == "":
                    result.append(
                        {
                            "full": " ",
                            "value": " ",
                            "onset": " ",
                            "final": " ",
                            "tone": " ",
                        }
                    )
                    continue
                pingying = pycantonese.characters_to_jyutping(word)
                pingying = pingying[0]
                parsedPingying = pycantonese.parse_jyutping(pingying[1])

                onset = parsedPingying[0].onset
                final = parsedPingying[0].nucleus + parsedPingying[0].coda
                tone = parsedPingying[0].tone
                result.append(
                    {
                        "full": pingying[1][:-1],
                        "onset": onset,
                        "final": final,
                        "value": word,
                        "tone": tone,
                    }
                )
    # dump to json with chinese character
    import json

    with open("files/output/song2.json", "w") as f:
        json.dump(result, f, ensure_ascii=False)
